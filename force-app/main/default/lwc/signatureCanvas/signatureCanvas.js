import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createFile from '@salesforce/apex/SignatureController.createFile';

export default class SignatureCanvas extends LightningElement {
    @api recordId; // Asegúrate de que el ID de registro se pase como propiedad pública
    canvas;
    ctx;

    renderedCallback() {
        if (!this.canvas) {
            this.canvas = this.template.querySelector('.signature-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.setupCanvas();
        }
    }

    setupCanvas() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;

        let drawing = false;

        this.canvas.addEventListener('mousedown', () => {
            drawing = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            drawing = false;
            this.ctx.beginPath();
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if (drawing) {
                this.ctx.lineTo(event.offsetX, event.offsetY);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(event.offsetX, event.offsetY);
            }
        });
    }

    handleSave() {
        const dataURL = this.canvas.toDataURL('image/png');
        const base64Data = dataURL.split(',')[1]; // Obtén el base64

        // Llama a tu método Apex para guardar el archivo
        createFile({ base64Data, fileName: 'Firma.png', contactId: this.recordId })
            .then(() => {
                this.showToast('Éxito', 'Firma guardada con éxito', 'success');
            })
            .catch((error) => {
                this.showToast('Error', 'No se pudo guardar la firma: ' + error.body.message, 'error');
            });
    }

    handleClear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(evt);
    }
}
