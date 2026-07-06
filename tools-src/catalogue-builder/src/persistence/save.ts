import JSZip from 'jszip';
import type { Project } from '../domain/project';

export const PROJECT_FILE_EXTENSION = '.catalogue.json.zip';

/**
 * Serializes the project (theme, pages, slots, and embedded asset data-URLs) into a single
 * zip file so a project is one downloadable/uploadable artifact - no server storage required.
 */
export async function saveProjectToBlob(project: Project): Promise<Blob> {
  const zip = new JSZip();
  zip.file('project.json', JSON.stringify(project, null, 2));
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export function downloadProject(project: Project): void {
  saveProjectToBlob(project).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9-_]+/gi, '_')}${PROJECT_FILE_EXTENSION}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}
