
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'


export default function exportCompaniesToPDF() {
    
    const pdf = new jsPDF('l', 'pt', 'a0');
    /*
    const specialElementHandlers = {
        '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    const margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };
    */

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
    
      var iframe = document.createElement('iframe');
      iframe.setAttribute('style', 'position:absolute;top:0;right:0;height:100%; width:600px');
      document.body.appendChild(iframe);
      iframe.src = pdf.output('datauristring');
      
      /*
    pdf.html(
        document.getElementById("listado_empresas"), {
            callback: function (pdf) {
                var iframe = document.createElement('iframe');
                iframe.setAttribute('style', 'position:absolute;top:0;right:0;height:100%; width:600px');
                document.body.appendChild(iframe);
                iframe.src = pdf.output('datauristring');
            }
        }
    );
    */
}
