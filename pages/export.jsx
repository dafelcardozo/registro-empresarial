
import { jsPDF } from "jspdf";


export default function demoFromHTML() {
    const pdf = new jsPDF('p', 'pt', 'letter');
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    //const source = $('#content')[0];

    // we support special element handlers. Register them with jQuery-style 
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors 
    // (class, of compound) at this time.
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
