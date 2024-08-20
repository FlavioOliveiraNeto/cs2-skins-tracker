import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SkinService } from '../../services/skin.service'; 

@Component({
  selector: 'app-skin',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './skin.component.html',
  styleUrl: './skin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkinComponent implements OnInit {
  skinId: any = null;
  skin: any = null;
  skinUrl: string | null = null;
  skinDetails: any = null;
  page: number = 1;
  loading: boolean = true;

  constructor(private skinService: SkinService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;
    this.skinId = this.route.snapshot.params['skin_id'];
    let key: string = 'K8Z80N5E7QG97DQB'
    let game: string = 'cs2'
    let currency: string = 'BRL'

    if(this.skinId) {
      this.skinService.getSkinById(this.skinId).subscribe(
        (data: any[]) => {
          if (data) {
            this.skin = data;
            this.skinUrl = this.skinService.generateSkinUrl(
              key,
              game,
              this.skin.weapon.name,
              this.skin.pattern.name,
              currency
            );
            
            if(this.skinUrl) {
              this.skinService.getSkinDetails(this.skinUrl).subscribe(
                (data: any[]) => {
                  if (data) {
                    this.skinDetails = data;
                  } else {
                    console.error('Detalhes do skin inválidos:', data);
                  }
                },
                (error: any) => {
                  console.error('Erro ao buscar detalhes do skin:', error);
                }
              )
            }
            
            this.loading = false;
          } else {
            console.error('Dados inválidos recebidos da API:', data);
          }
        },
        (error: any) => {
          console.error('Erro ao buscar dados da API:', error);
          this.loading = false;
        }
      );
    }
  }
}
