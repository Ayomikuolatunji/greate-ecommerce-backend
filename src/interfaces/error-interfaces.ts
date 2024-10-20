interface key {
  key: string;
}

interface InvalidStudent {
  name: string;
}

interface RequestError extends Error {
  status?: number;
  message?: string;
  statusCode?: number;
}

interface Error {
  message?: string;
  missingField?: key[];
  statusCode?: number;
  invalidStudents?: InvalidStudent[];
  missingStudents?: any[];
}

export type { RequestError, Error };
