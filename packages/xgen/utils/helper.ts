import { Common } from "@/types";
import moment from "moment";
import { nanoid } from "nanoid";

export function isPlainType(data: unknown): boolean {
    return typeof data === 'string' || typeof data === 'number';
}


export function firstWordUppercase(str: string) {
    return str[0].toUpperCase() + str.substring(1)
}


export function fillString(template: string, replacements: Record<string, any>): string {
    return template.replace(/\{([^}]+)\}/g, function(match, key) {
      return replacements[key] || '';
    });
}

export function objectKey(filename: string, template: string): string {
    const ext = filename.substring(filename.lastIndexOf('.') + 1)
    const data = {
        ext,
        hash: nanoid(16),
        date: moment().format('YYYY-MM-DD')
    }
    return fillString(template, data)
}

export function sortedColumn(columns: Common.Column[], sorted: string[]): Common.Column[] {
    if (!sorted || !sorted.length) {
        return columns
    }
    const newCols = []
    for(const key of sorted) {
        const col = columns.find(item => item.bind === key)
        if (col) {
            newCols.push(col);
        }
    }
    if (!newCols || !newCols.length) {
        return columns
    }
    return newCols;
}