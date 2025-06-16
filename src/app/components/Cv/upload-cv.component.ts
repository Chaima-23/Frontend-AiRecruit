import { Component } from '@angular/core';
import { CvExtractionService} from '../../core/services/cv-extraction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-cv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-cv.component.html',
  styleUrls: ['./upload-cv.component.css']
})
export class UploadCvComponent {
  selectedFile: File | null = null;
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private cvService: CvExtractionService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.error = null;
        this.successMessage = null;
      } else {
        this.error = 'Please upload a PDF file only.';
        this.selectedFile = null;
        this.successMessage = null;
      }
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.error = 'No file selected.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.cvService.extractTextFromPdf(this.selectedFile).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'CV uploaded successfully!'; // Set success message
        console.log('Texte extrait :', res.text);
        console.log('Texte json :', res.spring_response);
        // Set timeout to clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'An error occurred while extracting text.';
        console.error('Error:', err);
      }
    });
  }
}
