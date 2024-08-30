import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SkinService } from '../../services/skin.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

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
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: [
    './layout.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  skins: any[] = [];
  emptySlots: any[] = Array.from({ length: 15 }, () => ({ skin: null }));
  loading: boolean = true;

  carouselSlides: any[][] = [];
  currentSlide: number = 0;
  slidesCount: number = 0;

  draggedSkin: any = null;
  draggedSkinSlotIndex: number | null = null;

  isFilterModalOpen: boolean = false;
  selectedFilters: { [key: string]: string | null } = {
    name: null,
    type: null,
    collection: null,
    pattern: null,
    rarity: null,
    wear: null
  };  

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
              .map(skin => skin.weapon?.name)
              .filter(name => name && name.trim() !== '')
          );
          this.skinNames = Array.from(nameSet);

          const typeSet = new Set(
            this.skins
              .map(skin => skin.category?.name)
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
              .map(skin => skin.pattern?.name)
          );
          this.skinPatterns = Array.from(patternSet);

          const raritySet = new Set(
            this.skins
              .map(skin => skin.rarity?.name)
              .filter(name => name && name.trim() !== '')
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

          this.slidesCount = Math.ceil(this.filteredSkins.length / 16);
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
    if (!this.carouselSlides[slideIndex]) {
      const start = slideIndex * 16;
      const end = start + 16;
      this.carouselSlides[slideIndex] = this.filteredSkins.slice(start, end);
    }
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slidesCount - 1;
    this.loadSlide(this.currentSlide);
  }

  nextSlide(): void {
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
      this.emptySlots[index].skin = this.draggedSkin;
  
      const skinIndex = this.filteredSkins.findIndex(skin => skin.id === this.draggedSkin.id);
      if (skinIndex !== -1) {
        this.filteredSkins[skinIndex].disabled = true;
      }
  
      this.draggedSkin = null;
      this.draggedSkinSlotIndex = null;
    }
  }
  
  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
  
    if (this.draggedSkin && !this.emptySlots[index].skin) {
      this.emptySlots[index].skin = this.draggedSkin;
  
      const skinIndex = this.filteredSkins.findIndex(skin => skin.id === this.draggedSkin.id);
      if (skinIndex !== -1) {
        this.filteredSkins[skinIndex].disabled = true;
      }
  
      this.draggedSkin = null;
      this.draggedSkinSlotIndex = null;
    }
  }
  
  onDropToTable(event: DragEvent): void {
    event.preventDefault();
  
    if (this.draggedSkinSlotIndex !== null) {
      const skinIndex = this.filteredSkins.findIndex(skin => skin.id === this.draggedSkin.id);
      if (skinIndex !== -1) {
        this.filteredSkins[skinIndex].disabled = false;
      }
  
      this.emptySlots[this.draggedSkinSlotIndex].skin = null;
  
      this.draggedSkin = null;
      this.draggedSkinSlotIndex = null;
    }
  }

  openFilterModal(): void {
    this.isFilterModalOpen = true;
  }

  closeFilterModal(): void {
    this.isFilterModalOpen = false;
  }

  resetFilters():void {
    Object.keys(this.selectedFilters).forEach(key => {
      this.selectedFilters[key] = '';
    });
    this.applyFilters();
  }

  applyFilters(): void {
    const filter: Filter = Object.keys(this.selectedFilters).reduce((acc, key) => {
      const value = this.selectedFilters[key];
      acc[key] = value ? this.normalizeString(value) : null;
      return acc;
    }, {} as Filter);
  
    const filterFunctions: { [key: string]: (skin: Skin, filterValue: string) => boolean } = {
      name: (skin, filterValue) => skin.weapon ? this.normalizeString(skin.weapon.name).includes(filterValue) : false,
      type: (skin, filterValue) => skin.category ? this.normalizeString(skin.category.name).includes(filterValue) : false,
      collection: (skin, filterValue) =>
        skin.collections ? skin.collections.some(collection => this.normalizeString(collection.name).includes(filterValue)) : false,
      pattern: (skin, filterValue) => skin.pattern ? this.normalizeString(skin.pattern.name).includes(filterValue) : false,
      rarity: (skin, filterValue) => skin.rarity ? this.normalizeString(skin.rarity.name).includes(filterValue) : false,
      wear: (skin, filterValue) =>
        skin.wears ? skin.wears.some(wear => this.normalizeString(wear.name).includes(filterValue)) : false
    };
  
    this.filteredSkins = this.skins.filter((skin: Skin) => {
      return Object.keys(filter).every((key) => {
        const filterValue: string | null = filter[key];
        if (!filterValue) return true;
  
        const filterFunction = filterFunctions[key];
        return filterFunction ? filterFunction(skin, filterValue) : false;
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
    return input ? input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
  }
}