
import { jsPDF } from "jspdf";


export default function demoFromHTML() {
    // Weird.
    const pdf = new jsPDF('p', 'pt', 'letter');
    const specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
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
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.html(
        '<div>Hola</div>', {
            callback: function (pdf) {
                var iframe = document.createElement('iframe');
                iframe.setAttribute('style', 'position:absolute;top:0;right:0;height:100%; width:600px');
                document.body.appendChild(iframe);
                iframe.src = pdf.output('datauristring');
            }
        }
    );
}
