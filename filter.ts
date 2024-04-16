type DateType = Date | string;

export type Message = Record<string, string | boolean | DateType | number>;

type StringFilter = {
  type: "string";
  field: string;
  operation: "eq" | "startsWith" | "endsWith" | "contains";
  value: string;
};

type NumberFilter = {
  type: "number";
  field: string;
  operation: "eq" | "gt" | "lt" | "gte" | "lte";
  value: number;
};

type BooleanFilter = {
  type: "boolean";
  field: string;
  operation: "eq";
  value: boolean;
};

type DateFilter = {
  type: "date";
  field: string;
  operation: "eq" | "after" | "before";
  value: DateType;
};

type OrFilter = {
  type: "or";
  filters: Filter[];
};

type AndFilter = {
  type: "and";
  filters: Filter[];
};

type Filter =
  | StringFilter
  | NumberFilter
  | BooleanFilter
  | DateFilter
  | OrFilter
  | AndFilter;

function applyFilter(message: Message, filter: Filter): boolean {
  switch (filter.type) {
    case "string":
      return applyStringFilter(message[filter.field] as string, filter);
    case "number":
      return applyNumberFilter(message[filter.field] as number, filter);
    case "boolean":
      return applyBooleanFilter(message[filter.field] as boolean, filter);
    case "date":
      return applyDateFilter(message[filter.field] as DateType, filter);
    case "or":
      return applyOrFilter(message, filter);
    case "and":
      return applyAndFilter(message, filter);
    default:
      return false;
  }
}

function applyStringFilter(value: string, filter: StringFilter): boolean {
  if (!value) return false;
  switch (filter.operation) {
    case "eq":
      return value === filter.value;
    case "startsWith":
      return value.startsWith(filter.value);
    case "endsWith":
      return value.endsWith(filter.value);
    case "contains":
      return value.includes(filter.value);
    default:
      return false;
  }
}

function applyNumberFilter(value: number, filter: NumberFilter): boolean {
  if (!value) return false;
  switch (filter.operation) {
    case "eq":
      return value === filter.value;
    case "gt":
      return value > filter.value;
    case "lt":
      return value < filter.value;
    case "gte":
      return value >= filter.value;
    case "lte":
      return value <= filter.value;
    default:
      return false;
  }
}

function applyBooleanFilter(value: boolean, filter: BooleanFilter): boolean {
  return value === filter.value;
}

function applyDateFilter(value: DateType, filter: DateFilter): boolean {
  if (!value) return false;
  const dateValue = new Date(value);
  const filterDate = new Date(filter.value);
  switch (filter.operation) {
    case "eq":
      return dateValue.getTime() === filterDate.getTime();
    case "after":
      return dateValue.getTime() > filterDate.getTime();
    case "before":
      return dateValue.getTime() < filterDate.getTime();
    default:
      return false;
  }
}

function applyOrFilter(message: Message, filter: OrFilter): boolean {
  return filter.filters.some((subFilter) => applyFilter(message, subFilter));
}

function applyAndFilter(message: Message, filter: AndFilter): boolean {
  return filter.filters.every((subFilter) => applyFilter(message, subFilter));
}

export function filterMessages(messages: Message[], filter: Filter): Message[] {
  return messages.filter((message) => applyFilter(message, filter));
}
