import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SkinService } from '../../services/skin.service'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  skins: any[] = [];
  carouselSlides: any[][] = [];
  currentSlide: number = 0;
  slidesCount: number = 0;
  emptySlots: any[] = Array.from({ length: 15 }, () => ({ skin: null }));
  loading: boolean = true;
  draggedSkin: any = null;

  constructor(private skinService: SkinService) {}

  ngOnInit(): void {
    this.skinService.getSkins().subscribe(
      (data: any[]) => {
        if (data) {
          this.loading = true;
          this.skins = data;
          this.slidesCount = Math.ceil(this.skins.length / 16);

          // Carregar o primeiro slide
          this.loadSlide(this.currentSlide);

          this.loading = false;
        } else {
          console.error('Dados inválidos recebidos da API:', data);
          this.loading = false;
        }
      },
      (error) => {
        console.error('Erro ao buscar dados da API:', error);
        this.loading = false;
      }
    );
  }

  loadSlide(slideIndex: number): void {
    // Carregar o slide apenas se ainda não estiver carregado
    if (!this.carouselSlides[slideIndex]) {
      const start = slideIndex * 16;
      const end = start + 16;
      this.carouselSlides[slideIndex] = this.skins.slice(start, end);
    }
  }

  prevSlide(): void {
    // Muda para o slide anterior e carrega o slide
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slidesCount - 1;
    this.loadSlide(this.currentSlide);
  }

  nextSlide(): void {
    // Muda para o próximo slide e carrega o slide
    this.currentSlide = (this.currentSlide < this.slidesCount - 1) ? this.currentSlide + 1 : 0;
    this.loadSlide(this.currentSlide);
  }

  onDragStart(event: DragEvent, skin: any): void {
    if (!skin.disabled) {
      this.draggedSkin = skin;
      event.dataTransfer?.setData('text', JSON.stringify(skin));
      event.dataTransfer!.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    
    if (this.draggedSkin && !this.emptySlots[index].skin) {
      this.emptySlots[index].skin = this.draggedSkin;
      this.skins.find(s => s.id === this.draggedSkin.id).disabled = true;
      this.draggedSkin = null;
    }
  }
}
