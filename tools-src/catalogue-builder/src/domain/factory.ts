import { nanoid } from 'nanoid';
import { DEFAULT_THEME } from './theme';
import { PROJECT_SCHEMA_VERSION, type Page, type Project } from './project';
import { getLayout } from '../layouts/registry';
import { emptySlotValue } from './slot';

export function createNewProject(name = 'Untitled Catalogue'): Project {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name,
    createdAt: now,
    updatedAt: now,
    connection: null,
    theme: { ...DEFAULT_THEME },
    pages: [],
    assets: {},
    schemaVersion: PROJECT_SCHEMA_VERSION
  };
}

export function createPage(layoutId: string): Page {
  const layout = getLayout(layoutId);
  const slots: Page['slots'] = {};
  for (const schema of layout.slots) {
    slots[schema.id] = emptySlotValue(schema);
  }
  return { id: nanoid(), layoutId, slots };
}
