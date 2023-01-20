
import { jsPDF } from "jspdf";


export default function exportCompaniesToPDF() {
    // Weird.
    const pdf = new jsPDF('l', 'pt', 'letter');
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
}
