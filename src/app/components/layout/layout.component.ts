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
  styleUrls: ['./layout.component.scss'], // Corrige o nome da propriedade de styleUrl para styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  skins: any[] = [];
  page: number = 1;
  loading: boolean = true;

  constructor(private skinService: SkinService) {} // Use o serviço

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
}