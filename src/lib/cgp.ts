import { parse } from 'csv-parse/sync';
import { slugify } from './slugify';
import csvContent from '../data/cgp.csv?raw';

export interface Cgp {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  firmName: string;
  legalName: string;
  siren: string;
  siret: string;
  oriasNumber: string | null;
  oriasStatus: string | null;
  oriasCategories: string[];
  oriasLastCheckedAt: string | null;
  city: string;
  postalCode: string;
  departmentCode: string;
  departmentName: string;
  region: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  slug: string;
  isPublished: boolean;
  sourceUrl: string | null;
}

interface CgpCsvRow {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  firm_name: string;
  legal_name: string;
  siren: string;
  siret: string;
  orias_number: string;
  orias_status: string;
  orias_categories: string;
  orias_last_checked_at: string;
  city: string;
  postal_code: string;
  department_code: string;
  department_name: string;
  region: string;
  address: string;
  latitude: string;
  longitude: string;
  website: string;
  email: string;
  phone: string;
  linkedin: string;
  slug: string;
  is_published: string;
  source_url: string;
  notes: string;
}

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}

function parseBoolean(value: string | undefined): boolean {
  return (value ?? '').trim().toLowerCase() === 'true';
}

function parseFloatOrNull(value: string | undefined): number | null {
  const trimmed = value?.trim() ?? '';
  if (trimmed === '') return null;
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOriasCategories(value: string | undefined): string[] {
  const trimmed = value?.trim() ?? '';
  if (trimmed === '') return [];
  return trimmed
    .split(';')
    .map((category) => category.trim())
    .filter((category) => category !== '');
}

function rowToCgp(row: CgpCsvRow): Cgp {
  const displayName = row.display_name?.trim() ?? '';
  const city = row.city?.trim() ?? '';
  const slug = emptyToNull(row.slug) ?? slugify(`${displayName}-${city}`);

  return {
    id: row.id?.trim() ?? '',
    displayName,
    firstName: row.first_name?.trim() ?? '',
    lastName: row.last_name?.trim() ?? '',
    firmName: row.firm_name?.trim() ?? '',
    legalName: row.legal_name?.trim() ?? '',
    siren: row.siren?.trim() ?? '',
    siret: row.siret?.trim() ?? '',
    oriasNumber: emptyToNull(row.orias_number),
    oriasStatus: emptyToNull(row.orias_status),
    oriasCategories: parseOriasCategories(row.orias_categories),
    oriasLastCheckedAt: emptyToNull(row.orias_last_checked_at),
    city,
    postalCode: row.postal_code?.trim() ?? '',
    departmentCode: row.department_code?.trim() ?? '',
    departmentName: row.department_name?.trim() ?? '',
    region: row.region?.trim() ?? '',
    address: row.address?.trim() ?? '',
    latitude: parseFloatOrNull(row.latitude),
    longitude: parseFloatOrNull(row.longitude),
    website: emptyToNull(row.website),
    email: emptyToNull(row.email),
    phone: emptyToNull(row.phone),
    linkedin: emptyToNull(row.linkedin),
    slug,
    isPublished: parseBoolean(row.is_published),
    sourceUrl: emptyToNull(row.source_url),
  };
}

let cachedCgps: Cgp[] | null = null;

/** Parses the CSV file once per build, then returns the cached list. */
export function getAllCgps(): Cgp[] {
  if (cachedCgps) return cachedCgps;

  const rows: CgpCsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  cachedCgps = rows.map(rowToCgp);
  return cachedCgps;
}

export function getPublishedCgps(): Cgp[] {
  return getAllCgps().filter((cgp) => cgp.isPublished);
}

export function getCgpBySlug(slug: string): Cgp | undefined {
  return getPublishedCgps().find((cgp) => cgp.slug === slug);
}

export function getCities(): string[] {
  const cities = new Set(getPublishedCgps().map((cgp) => cgp.city));
  return Array.from(cities).sort((a, b) => a.localeCompare(b, 'fr'));
}

export function getDepartments(): { code: string; name: string }[] {
  const departments = new Map<string, string>();
  for (const cgp of getPublishedCgps()) {
    departments.set(cgp.departmentCode, cgp.departmentName);
  }
  return Array.from(departments.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function getCgpsByCity(city: string): Cgp[] {
  return getPublishedCgps().filter(
    (cgp) => slugify(cgp.city) === slugify(city),
  );
}

export function getCgpsByDepartment(departmentCode: string): Cgp[] {
  return getPublishedCgps().filter(
    (cgp) => cgp.departmentCode === departmentCode,
  );
}
