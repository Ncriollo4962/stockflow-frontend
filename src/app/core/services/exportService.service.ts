import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportExcel(
    data: any[],
    fileName: string,
    options?: {
      title?: string;
      subtitle?: string;
      meta?: Array<{ label: string; value: string }>;
      sheetName?: string;
    },
  ) {
    const headers = data?.length ? Object.keys(data[0]) : [];
    const colCount = Math.max(headers.length, 2);

    const aoa: any[][] = [];
    const title = options?.title || fileName;
    aoa.push([title]);

    if (options?.subtitle) aoa.push([options.subtitle]);

    const meta = options?.meta ?? [];
    if (meta.length > 0) {
      aoa.push([]);
      aoa.push(['Campo', 'Valor']);
      for (const item of meta) {
        aoa.push([item.label ?? '', item.value ?? '']);
      }
      aoa.push([]);
    } else {
      aoa.push([]);
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.sheet_add_json(ws, data ?? [], {
      origin: { r: aoa.length, c: 0 },
    });

    const merges: XLSX.Range[] = [];
    if (colCount > 1) {
      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } });
      if (options?.subtitle) {
        merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } });
      }
    }
    if (merges.length > 0) (ws as any)['!merges'] = merges;

    (ws as any)['!cols'] = headers.map((h) => ({
      wch: Math.min(Math.max(String(h).length, 12), 40),
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Reporte');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  exportPdf(
    columns: string[],
    data: any[],
    title: string,
    options?: {
      subtitle?: string;
      meta?: Array<{ label: string; value: string }>;
      extraHeadRows?: Array<
        Array<{
          content: string;
          colSpan?: number;
          styles?: Record<string, any>;
        }>
      >;
      orientation?: 'portrait' | 'landscape';
    },
  ) {
    const orientation = options?.orientation === 'portrait' ? 'p' : 'l';
    const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

    const marginX = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text(title, marginX, y);
    y += 6;

    if (options?.subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      doc.text(options.subtitle, marginX, y);
      y += 6;
    }

    const meta = options?.meta ?? [];
    if (meta.length > 0) {
      const cols = 4;
      const gap = 4;
      const boxW = (pageWidth - marginX * 2 - gap * (cols - 1)) / cols;
      const boxH = 14;

      const rows = Math.ceil(meta.length / cols);

      for (let i = 0; i < meta.length; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = marginX + c * (boxW + gap);
        const yBox = y + r * (boxH + gap);

        doc.setDrawColor(229, 231, 235);
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(x, yBox, boxW, boxH, 2, 2, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text(String(meta[i].label ?? ''), x + 2, yBox + 5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(17, 24, 39);
        const valueLines = doc.splitTextToSize(
          String(meta[i].value ?? ''),
          boxW - 4,
        );
        doc.text(valueLines.slice(0, 2), x + 2, yBox + 11);
      }

      y += rows * (boxH + gap) + 2;
    }

    const columnStyles: Record<number, any> | undefined =
      columns.length === 11
        ? {
            0: { cellWidth: 18 },
            1: { cellWidth: 55 },
            2: { cellWidth: 35 },
            3: { cellWidth: 14 },
            4: { cellWidth: 22 },
            5: { cellWidth: 22 },
            6: { cellWidth: 24 },
            7: { cellWidth: 14 },
            8: { cellWidth: 33 },
            9: { cellWidth: 24 },
            10: { cellWidth: 16 },
          }
        : undefined;

    const extraHeadRows = (options?.extraHeadRows ?? []).map((row) => row);
    const head = [
      ...extraHeadRows,
      columns.map((c) => ({ content: c })),
    ] as any[];

    autoTable(doc, {
      head,
      body: data,
      startY: y + (meta.length > 0 ? 2 : 0),
      theme: 'grid',
      tableWidth: pageWidth - marginX * 2,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'top',
        textColor: [55, 65, 81],
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles,
      margin: { left: marginX, right: marginX },
    });

    doc.save(`${title}.pdf`);
  }
}
