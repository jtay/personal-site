import JSZip from 'jszip';
import { PROJECT_SCHEMA_VERSION, type Project } from '../domain/project';

export class ProjectLoadError extends Error {}

/** Central place to upgrade older save files as the schema evolves. */
function migrate(raw: Project): Project {
  if (raw.schemaVersion === PROJECT_SCHEMA_VERSION) return raw;
  if (raw.schemaVersion > PROJECT_SCHEMA_VERSION) {
    throw new ProjectLoadError('This project was saved with a newer version of the Catalogue Builder.');
  }
  // Future migrations branch on raw.schemaVersion here.
  return { ...raw, schemaVersion: PROJECT_SCHEMA_VERSION };
}

export async function loadProjectFromFile(file: File): Promise<Project> {
  const zip = await JSZip.loadAsync(file);
  const entry = zip.file('project.json');
  if (!entry) {
    throw new ProjectLoadError('Not a valid Catalogue Builder project file.');
  }
  const text = await entry.async('text');
  let parsed: Project;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ProjectLoadError('Project file is corrupted.');
  }
  if (!parsed.id || !Array.isArray(parsed.pages)) {
    throw new ProjectLoadError('Project file is missing required fields.');
  }
  return migrate(parsed);
}
