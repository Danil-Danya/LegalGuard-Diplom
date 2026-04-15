import type { ContractDocumentPayload } from './types';

interface ContractPartyAssetSources {
    signatureSrc?: string | null;
    stampSrc?: string | null;
}

interface ContractExportOptions {
    partyAssetSources?: Record<string, ContractPartyAssetSources>;
}

const escapeHtml = (value: string) => {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
};

const escapeWithBreaks = (value: string) => {
    return escapeHtml(value).replaceAll('\n', '<br>');
};

const normalizeFileName = (value: string) => {
    const cleanedValue = value
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]+/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return cleanedValue || 'document';
};

const buildSigningHtml = (label: string, src: string) => {
    return `
        <div class="signing-block">
            <p class="signing-label">${escapeHtml(label)}</p>
            <div class="signing-frame">
                <img src="${src}" alt="${escapeHtml(label)}">
            </div>
        </div>
    `;
};

export const buildContractExportHtml = (
    payload: ContractDocumentPayload,
    options: ContractExportOptions = {},
) => {
    const formattedDate = payload.documentDate
        ? payload.documentDate.split('-').reverse().join('.')
        : '';

    const headerMeta = [payload.documentPlace, formattedDate]
        .filter(Boolean)
        .join(', ');

    const sectionsHtml = payload.body
        .filter((section) => section.text.trim().length > 0 || section.items.some((item) => item.text.trim().length > 0))
        .map((section) => {
            const sectionTextHtml = section.text.trim().length > 0
                ? `<p class="section-text">${escapeWithBreaks(section.text)}</p>`
                : '';

            const itemsHtml = section.items
                .filter((item) => item.text.trim().length > 0)
                .map((item) => {
                    return `
                        <article class="item">
                            <p class="item-number">${escapeHtml(item.number)}</p>
                            <div>
                                <p class="item-title">${escapeHtml(item.title)}</p>
                                <p class="item-text">${escapeWithBreaks(item.text)}</p>
                            </div>
                        </article>
                    `;
                })
                .join('');

            return `
                <article class="section">
                    <div class="section-header">
                        <h3 class="section-title">${escapeHtml(section.number)}. ${escapeHtml(section.title)}</h3>
                    </div>
                    ${sectionTextHtml}
                    ${itemsHtml ? `<div class="items">${itemsHtml}</div>` : ''}
                </article>
            `;
        })
        .join('');

    const partiesHtml = payload.parties
        .filter((party) => party.fields.some((field) => field.text.trim().length > 0))
        .map((party) => {
            const fieldsHtml = party.fields
                .filter((field) => field.text.trim().length > 0)
                .map((field) => {
                    return `
                        <div class="party-field">
                            <p class="party-field-label">${escapeHtml(field.title)}</p>
                            <p class="party-field-text">${escapeWithBreaks(field.text)}</p>
                        </div>
                    `;
                })
                .join('');

            return `
                <article class="party-card">
                    <h4 class="party-title">${escapeHtml(party.title)}</h4>
                    <div class="party-fields">${fieldsHtml}</div>
                </article>
            `;
        })
        .join('');

    const signingHtml = payload.parties
        .map((party) => {
            const partyAssets = options.partyAssetSources?.[party.key];
            const signatureSrc = partyAssets?.signatureSrc;
            const stampSrc = partyAssets?.stampSrc;

            if (!signatureSrc && !stampSrc) {
                return '';
            }

            return `
                <article class="signing-party">
                    <h4 class="signing-party-title">${escapeHtml(party.title)}</h4>
                    <div class="signing-assets">
                        ${signatureSrc ? buildSigningHtml(party.signing.signatureTitle || 'Подпись', signatureSrc) : ''}
                        ${stampSrc ? buildSigningHtml(party.signing.stampTitle || 'Печать', stampSrc) : ''}
                    </div>
                </article>
            `;
        })
        .filter(Boolean)
        .join('');

    return `
        <!DOCTYPE html>
        <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${escapeHtml(payload.title)}</title>
                <style>
                    @page { size: A4; margin: 0; }
                    * { box-sizing: border-box; }
                    body { margin: 0; background: #f4f1ea; color: #000; font-family: "Times New Roman", serif; }
                    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm 12mm; background: #fff; }
                    .header { border-bottom: 0.2mm solid rgba(0, 0, 0, 0.12); padding-bottom: 4mm; text-align: center; }
                    .meta { color: rgba(0, 0, 0, 0.7); font-size: 9pt; line-height: 13pt; }
                    .title { margin: 3mm 0 0; font-size: 22pt; font-weight: 700; line-height: 24pt; letter-spacing: -0.03em; text-transform: uppercase; }
                    .intro { padding-top: 4mm; }
                    .paragraph, .section-text, .item-text, .party-field-text { margin: 0; color: rgba(0, 0, 0, 0.82); font-size: 11pt; line-height: 16pt; }
                    .sections { display: grid; gap: 5mm; padding-top: 5mm; }
                    .section { display: grid; gap: 2.5mm; }
                    .section-header { border-bottom: 0.2mm solid rgba(0, 0, 0, 0.1); padding-bottom: 2mm; }
                    .section-title { margin: 0; font-size: 14pt; font-weight: 700; line-height: 18pt; }
                    .items { display: grid; gap: 2.5mm; }
                    .item { display: grid; grid-template-columns: 15mm minmax(0, 1fr); gap: 2mm; }
                    .item-number, .item-title, .party-title, .parties-title, .signing-party-title { margin: 0; color: #000; }
                    .item-number { font-size: 10pt; font-weight: 700; line-height: 14pt; }
                    .item-title { font-size: 11pt; font-weight: 600; line-height: 14pt; }
                    .parties, .signing { border-top: 0.2mm solid rgba(0, 0, 0, 0.1); padding-top: 6mm; margin-top: 6mm; }
                    .parties-title { font-size: 14pt; font-weight: 700; line-height: 18pt; }
                    .party-grid, .signing { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4mm; }
                    .party-grid { margin-top: 4mm; }
                    .party-card, .signing-party { border: 0.2mm solid rgba(0, 0, 0, 0.1); border-radius: 3mm; padding: 4mm; }
                    .party-title, .signing-party-title { font-size: 12pt; font-weight: 700; line-height: 15pt; }
                    .party-fields { display: grid; gap: 2.5mm; margin-top: 3mm; }
                    .party-field { display: grid; gap: 1mm; }
                    .party-field-label, .signing-label { margin: 0; color: rgba(0, 0, 0, 0.45); font-size: 8pt; line-height: 10pt; letter-spacing: 0.16em; text-transform: uppercase; }
                    .signing-assets { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4mm; margin-top: 3mm; }
                    .signing-block { display: grid; gap: 3.5mm; }
                    .signing-frame { border: 0.2mm dashed rgba(0, 0, 0, 0.15); border-radius: 3mm; padding: 4mm; min-height: 36mm; }
                    .signing-frame img { display: block; width: auto; max-width: 100%; height: 26mm; object-fit: contain; }
                    @media print { body { background: #fff; } .page { margin: 0; } }
                </style>
            </head>
            <body>
                <article class="page">
                    <header class="header">
                        ${headerMeta ? `<p class="meta">${escapeHtml(headerMeta)}</p>` : ''}
                        <h1 class="title">${escapeHtml(payload.title)}</h1>
                    </header>

                    <section class="intro">
                        <p class="paragraph">
                            ${escapeHtml(payload.firstParty || 'Лицо 1 не указано')}
                            и
                            ${escapeHtml(payload.secondParty || 'Лицо 2 не указано')}
                            заключили настоящий документ на условиях, указанных ниже.
                        </p>
                    </section>

                    ${sectionsHtml ? `<section class="sections">${sectionsHtml}</section>` : ''}
                    ${partiesHtml ? `<section class="parties"><h3 class="parties-title">Стороны документа</h3><div class="party-grid">${partiesHtml}</div></section>` : ''}
                    ${signingHtml ? `<section class="signing">${signingHtml}</section>` : ''}
                </article>
            </body>
        </html>
    `;
};

const triggerBlobDownload = (blob: Blob, fileName: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    downloadLink.click();

    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
    }, 1000);
};

export const readFileAsDataUrl = (file?: File | null) => {
    if (!file) {
        return Promise.resolve<string | null>(null);
    }

    return new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(typeof reader.result === 'string' ? reader.result : null);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
};

export const downloadContractDoc = (
    payload: ContractDocumentPayload,
    options: ContractExportOptions = {},
) => {
    const html = buildContractExportHtml(payload, options);
    const blob = new Blob([html], {
        type: 'application/msword;charset=utf-8',
    });

    triggerBlobDownload(blob, `${normalizeFileName(payload.templateSlug || payload.title)}.doc`);
};

export const openContractPdfPrint = (
    payload: ContractDocumentPayload,
    options: ContractExportOptions = {},
) => {
    const html = buildContractExportHtml(payload, options);
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');

    if (!printWindow) {
        return false;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 250);

    return true;
};
