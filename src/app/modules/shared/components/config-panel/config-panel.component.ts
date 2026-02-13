import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeNG } from 'primeng/config';
import { PopoverModule } from 'primeng/popover';
import { SelectButtonModule } from 'primeng/selectbutton';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';
import Material from '@primeng/themes/material';

@Component({
  selector: 'config-panel',
  imports: [PopoverModule, SelectButtonModule, FormsModule, CommonModule],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.scss',
})
export class ConfigPanelComponent {
  @ViewChild('op') popover: any;
  @Input() menuMode = 'static'; // Recibido del MainLayout o manejado aquí
  @Output() menuModeChange = new EventEmitter<'static' | 'overlay'>();

  private readonly config = inject(PrimeNG);

  primaryColors = [
    {
      name: 'emerald',
      palette: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
      },
    },
    {
      name: 'green',
      palette: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
    },
    {
      name: 'lime',
      palette: {
        50: '#f7fee7',
        100: '#ecfccb',
        200: '#d9f99d',
        300: '#bef264',
        400: '#a3e635',
        500: '#84cc16',
        600: '#65a30d',
        700: '#4d7c0f',
        800: '#3f6212',
        900: '#365314',
        950: '#1a2e05',
      },
    },
    {
      name: 'orange',
      palette: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
        950: '#431407',
      },
    },
    {
      name: 'amber',
      palette: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
      },
    },
    {
      name: 'yellow',
      palette: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
        950: '#422006',
      },
    },
    {
      name: 'teal',
      palette: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
        950: '#042f2e',
      },
    },
    {
      name: 'cyan',
      palette: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
        950: '#083344',
      },
    },
    {
      name: 'sky',
      palette: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
      },
    },
    {
      name: 'blue',
      palette: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
    },
    {
      name: 'indigo',
      palette: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
        950: '#1e1b4b',
      },
    },
    {
      name: 'violet',
      palette: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
        950: '#2e1065',
      },
    },
    {
      name: 'purple',
      palette: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
        950: '#3b0764',
      },
    },
    {
      name: 'fuchsia',
      palette: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef',
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
        950: '#4a044e',
      },
    },
    {
      name: 'pink',
      palette: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
        950: '#500724',
      },
    },
    {
      name: 'rose',
      palette: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
        950: '#4c0519',
      },
    },
    {
      name: 'slate',
      palette: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
    },
    {
      name: 'gray',
      palette: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    {
      name: 'zinc',
      palette: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
    },
    {
      name: 'neutral',
      palette: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
    },
    {
      name: 'stone',
      palette: {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09',
      },
    },
  ];

  surfaces = [
    {
      name: 'slate',
      palette: {
        0: '#ffffff',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
    },
    {
      name: 'gray',
      palette: {
        0: '#ffffff',
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    {
      name: 'zinc',
      palette: {
        0: '#ffffff',
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
    },
    {
      name: 'neutral',
      palette: {
        0: '#ffffff',
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
    },
    {
      name: 'stone',
      palette: {
        0: '#ffffff',
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09',
      },
    },
    {
      name: 'soho',
      palette: {
        0: '#ffffff',
        50: '#f4f4f4',
        100: '#e8e8e8',
        200: '#dcdcdc',
        300: '#bdbdbd',
        400: '#a5a5a5',
        500: '#8d8d8d',
        600: '#767676',
        700: '#5e5e5e',
        800: '#474747',
        900: '#2f2f2f',
        950: '#181818',
      },
    },
    {
      name: 'viva',
      palette: {
        0: '#ffffff',
        50: '#f3f3f3',
        100: '#e7e7e7',
        200: '#dbdbdb',
        300: '#c0c0c0',
        400: '#a4a4a4',
        500: '#898989',
        600: '#6d6d6d',
        700: '#525252',
        800: '#363636',
        900: '#1b1b1b',
        950: '#000000',
      },
    },
    {
      name: 'ocean',
      palette: {
        0: '#ffffff',
        50: '#fbfcfc',
        100: '#f7f9f9',
        200: '#eff2f2',
        300: '#dadede',
        400: '#b1b7b9',
        500: '#899195',
        600: '#697175',
        700: '#4f5659',
        800: '#383d40',
        900: '#222628',
        950: '#0d0e0f',
      },
    },
  ];

  presets = [
    { label: 'Aura', value: Aura },
    { label: 'Material', value: Material },
    { label: 'Lara', value: Lara },
    { label: 'Nora', value: Nora },
  ];

  menuModes = [
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' },
  ];

  selectedPrimaryColor = this.primaryColors.find((c) => c.name === 'emerald');
  selectedSurfaceColor = this.surfaces.find((s) => s.name === 'slate');
  selectedPreset = Aura;

  updatePrimaryColor(primaryColor: any) {
    this.selectedPrimaryColor = primaryColor;
    const palette = primaryColor.palette;
    const element = document.querySelector('html');
    if (element) {
      element.style.setProperty('--p-primary-50', palette[50]);
      element.style.setProperty('--p-primary-100', palette[100]);
      element.style.setProperty('--p-primary-200', palette[200]);
      element.style.setProperty('--p-primary-300', palette[300]);
      element.style.setProperty('--p-primary-400', palette[400]);
      element.style.setProperty('--p-primary-500', palette[500]);
      element.style.setProperty('--p-primary-600', palette[600]);
      element.style.setProperty('--p-primary-700', palette[700]);
      element.style.setProperty('--p-primary-800', palette[800]);
      element.style.setProperty('--p-primary-900', palette[900]);
      element.style.setProperty('--p-primary-950', palette[950]);
    }
  }

  updateSurfaceColor(surfaceColor: any) {
    this.selectedSurfaceColor = surfaceColor;
    const palette = surfaceColor.palette;
    const element = document.querySelector('html');
    if (element) {
      element.style.setProperty('--p-surface-0', palette[0]);
      element.style.setProperty('--p-surface-50', palette[50]);
      element.style.setProperty('--p-surface-100', palette[100]);
      element.style.setProperty('--p-surface-200', palette[200]);
      element.style.setProperty('--p-surface-300', palette[300]);
      element.style.setProperty('--p-surface-400', palette[400]);
      element.style.setProperty('--p-surface-500', palette[500]);
      element.style.setProperty('--p-surface-600', palette[600]);
      element.style.setProperty('--p-surface-700', palette[700]);
      element.style.setProperty('--p-surface-800', palette[800]);
      element.style.setProperty('--p-surface-900', palette[900]);
      element.style.setProperty('--p-surface-950', palette[950]);
    }
  }

  onPresetChange(event: any): void {
    this.config.theme.set({ preset: event.value });
  }

  // toggle(event: Event): void {
  //   if (this.popover) {
  //     this.popover.toggle(event);
  //   }
  // }
  toggle(event: Event) {
    this.popover.toggle(event);
  }
}
