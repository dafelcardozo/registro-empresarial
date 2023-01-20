
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'


export default function exportCompaniesToPDF() {
    if (process.browser) {
    const pdf = new jsPDF('l', 'pt', 'a0');
    autoTable(pdf, {
        html: '#listado_empresas',
        startY: 60,
        styles: {
          fontSize: 50,
          cellWidth: 'wrap'
        },
        columnStyles: {
          1: {columnWidth: 'auto'}
        }
      });
      
      const iframe = document.createElement('iframe');
      iframe.setAttribute('style', 'position:absolute;top:0;right:0;height:100%; width:600px');
      document.body.appendChild(iframe);
      iframe.src = pdf.output('datauristring');
    }
}
