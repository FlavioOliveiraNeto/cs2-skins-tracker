import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SkinService } from '../../services/skin.service';
import { FormsModule } from '@angular/forms';
interface Skin {
  id: string;
  weapon?: { name: string };
  category?: { name: string };
  collections?: { name: string }[];
  pattern?: { name: string };
  rarity?: { name: string };
  wears?: { name: string }[];
  disabled?: boolean;
}

interface Filter {
  [key: string]: string | null;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  /*Configuração geral*/
  skins: any[] = [];
  emptySlots: any[] = Array.from({ length: 15 }, () => ({ skin: null }));
  loading: boolean = true;
  
  /*Configuração carrossel*/
  carouselSlides: any[][] = [];
  currentSlide: number = 0;
  slidesCount: number = 0;
  
  /*Configuração Drag and Drop*/
  draggedSkin: any = null;
  draggedSkinSlotIndex: number | null = null; 

  /*Configuração modal*/
  isFilterModalOpen: boolean = false;
  selectedName: string = '';
  selectedType: string = '';
  selectedCollection: string = '';
  selectedPattern: string = '';
  selectedRarity: string = '';
  selectedWear: string = '';

  /*Configuração do filtro de skins*/
  filteredSkins: any[] = [];
  skinNames: any[] = [];
  skinTypes: any[] = [];
  skinCollections: any[] = [];
  skinPatterns: any[] = [];
  skinRaritys: any[] = [];
  skinWears: any[] = [];

  constructor(private skinService: SkinService) {}

  ngOnInit(): void {
    this.skinService.getSkins().subscribe(
      (data: any[]) => {
        if (data) {
          this.loading = true;
          this.skins = data;
          this.filteredSkins = data;

          const nameSet = new Set(
            this.skins
              .map(skin => skin.weapon.name)
              .filter(name => name && name.trim() !== '')
          );
          this.skinNames = Array.from(nameSet);

          const typeSet = new Set(
            this.skins
              .map(skin => skin.category.name)
              .filter(name => name && name.trim() !== '')
          );
          this.skinTypes = Array.from(typeSet);

          const collectionSet = new Set(
            this.skins
              .filter(skin => skin.collections && skin.collections.length > 0)
              .flatMap(skin => 
                skin.collections
                  .map((skinCollection: { name: any }) => skinCollection.name)
                  .filter((name: string) => name && name.trim() !== '')
              )
          );
          this.skinCollections = Array.from(collectionSet);

          const patternSet = new Set(
            this.skins
              .filter(skin => skin.pattern)
              .flatMap(skin => skin.pattern.name)
          );
          this.skinPatterns = Array.from(patternSet);

          const raritySet = new Set(
            this.skins
              .filter(skin => skin.rarity)
              .flatMap(skin => skin.rarity.name)
          );
          this.skinRaritys = Array.from(raritySet);

          const wearSet = new Set(
            this.skins
              .filter(skin => skin.wears && skin.wears.length > 0)
              .flatMap(skin => 
                skin.wears
                  .map((skinWear: { name: any }) => skinWear.name)
                  .filter((name: string) => name && name.trim() !== '')
              )
          );
          this.skinWears = Array.from(wearSet);

          console.log(this.filteredSkins)
          this.slidesCount = Math.ceil(this.filteredSkins.length / 16);

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
      this.carouselSlides[slideIndex] = this.filteredSkins.slice(start, end);
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

  onSlotDragStart(event: DragEvent, slot: any, index: number): void {
    if (slot.skin) {
      this.draggedSkin = slot.skin;
      this.draggedSkinSlotIndex = index;
      event.dataTransfer?.setData('text', JSON.stringify(slot.skin));
      event.dataTransfer!.effectAllowed = 'move';
    }
  }
  
  onDropSlot(event: DragEvent, index: number): void {
    event.preventDefault();
  
    if (this.draggedSkin && !this.emptySlots[index].skin) {
      // Atribui a skin ao slot
      this.emptySlots[index].skin = this.draggedSkin;
  
      // Desabilita a skin na tabela
      const skinIndex = this.filteredSkins.findIndex(skin => skin.id === this.draggedSkin.id);
      if (skinIndex !== -1) {
        this.filteredSkins[skinIndex].disabled = true;
      }
  
      // Limpa a skin arrastada
      this.draggedSkin = null;
      this.draggedSkinSlotIndex = null;
    }
  }
  
  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
  
    if (this.draggedSkin && !this.emptySlots[index].skin) {
      // Atribui a skin ao slot
      this.emptySlots[index].skin = this.draggedSkin;
  
      // Desabilita a skin na tabela
      const skinIndex = this.filteredSkins.findIndex(skin => skin.id === this.draggedSkin.id);
      if (skinIndex !== -1) {
        this.filteredSkins[skinIndex].disabled = true;
      }
  
      // Limpa a skin arrastada
      this.draggedSkin = null;
      this.draggedSkinSlotIndex = null;
    }
  }
  
  onDropToTable(event: DragEvent): void {
    event.preventDefault();
  
    if (this.draggedSkinSlotIndex !== null) {
      // Habilita a skin na tabela
      const skinIndex = this.filteredSkins.findIndex(skin => skin.id === this.draggedSkin.id);
      if (skinIndex !== -1) {
        this.filteredSkins[skinIndex].disabled = false;
      }
  
      // Remove a skin do slot
      this.emptySlots[this.draggedSkinSlotIndex].skin = null;
  
      // Limpa a skin arrastada
      this.draggedSkin = null;
      this.draggedSkinSlotIndex = null;
    }
  }

  // Métodos para controle do modal de filtro
  openFilterModal(): void {
    this.isFilterModalOpen = true;
  }

  closeFilterModal(): void {
    this.isFilterModalOpen = false;
  }

  resetFilters():void {
    this.selectedName = '';
    this.selectedType = '';
    this.selectedCollection = '';
    this.selectedPattern = '';
    this.selectedRarity = '';
    this.selectedWear = '';
  }

  applyFilters(): void {
    // Define o objeto filter
    const filter: Filter = {
      name: this.selectedName ? this.normalizeString(this.selectedName) : null,
      type: this.selectedType ? this.normalizeString(this.selectedType) : null,
      collection: this.selectedCollection ? this.normalizeString(this.selectedCollection) : null,
      pattern: this.selectedPattern ? this.normalizeString(this.selectedPattern) : null,
      rarity: this.selectedRarity ? this.normalizeString(this.selectedRarity) : null,
      wear: this.selectedWear ? this.normalizeString(this.selectedWear) : null,
    };

    // Filtra as skins com base nos critérios
    this.filteredSkins = this.skins.filter((skin: Skin) => {
      return Object.keys(filter).every((key) => {
        const filterValue: string | null = filter[key];
        
        if (filterValue === null || filterValue === undefined) {
          return true; // Ignora filtros nulos ou indefinidos
        }
    
        // Obtém o valor correspondente da skin
        const skinValue = skin[key as keyof Skin] as string;
        
        if (skinValue === null || skinValue === undefined) {
          return true; // Ignora filtros nulos ou indefinidos
        }

        return skinValue ? this.normalizeString(skinValue).includes(filterValue) : false;
      });
    });

    // Atualiza o carrossel e o filtro
    this.slidesCount = Math.ceil(this.filteredSkins.length / 16);
    this.carouselSlides = [];
    this.currentSlide = 0;
    this.loadSlide(this.currentSlide);
    this.closeFilterModal();
  }

  normalizeString(input: string): string {
    if(input) {
      return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } else {
      return '';
    }
  }
}
