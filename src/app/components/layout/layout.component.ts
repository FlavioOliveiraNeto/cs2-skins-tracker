import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { SkinService } from '../../services/skin.service'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  skins: any[] = [];
  emptySlots: any[] = [
    { skin: null }, 
    { skin: null }, 
    { skin: null }, 
    { skin: null },
    { skin: null }, 
    { skin: null }, 
    { skin: null }, 
    { skin: null },
    { skin: null }, 
    { skin: null }, 
    { skin: null }, 
    { skin: null },
    { skin: null }, 
    { skin: null }, 
    { skin: null },
  ];
  page: number = 1;
  loading: boolean = true;
  draggedSkin: any = null;

  constructor(private skinService: SkinService) {}

  ngOnInit(): void {
    this.loading = true;
    this.skinService.getSkins().subscribe(
      (data: any[]) => {
        if (data) {
          this.skins = data;
          this.loading = false;
        } else {
          console.error('Dados inválidos recebidos da API:', data);
        }
      },
      (error) => {
        console.error('Erro ao buscar dados da API:', error);
        this.loading = false;
      }
    );
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