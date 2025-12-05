import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService, Obra } from './services/firestore.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  firestoreService = inject(FirestoreService);
  obras: Obra[] = [];
  usuario: any = null;

  modoOscuro = false;
  idioma = 'es'; 

  // --- DICCIONARIO DE TRADUCCIONES ---
  textos: any = {
    es: { 
      titulo: 'Galería Arte', 
      entrar: 'Entrar con Google', 
      salir: 'Salir', 
      borrar: 'Borrar', 
      editar: 'Editar', 
      agregar: 'Nueva Obra', 
      pie: 'Derechos Reservados',
      // Menú Header
      menu_inicio: 'Inicio',
      menu_galeria: 'Galería',
      menu_nosotros: 'Nosotros',
      menu_contacto: 'Contacto',
      // Etiquetas de la Tarjeta
      lbl_autor: 'Autor',
      lbl_cat: 'Categoría',
      lbl_fecha: 'Fecha',
      // Footer
      ft_tit1: '¿QUÉ ENCONTRARÁS?',
      ft_l1: 'Obras Originales',
      ft_l2: 'Artistas Emergentes',
      ft_l3: 'Exposiciones Virtuales',
      ft_l4: 'Subastas en Vivo',
      ft_tit2: 'SÍGUENOS EN REDES',
      ft_tit3: '¿NOS CUENTAS TU PROYECTO?',
      ft_desc: 'Espacio de difusión cultural y venta de obras.',
      ft_dir: 'C/ De las Artes 33. Madrid, España',
      ft_aviso: 'Aviso legal',
      ft_priv: 'Privacidad y Cookies'
    },
    en: { 
      titulo: 'Art Gallery', 
      entrar: 'Login with Google', 
      salir: 'Logout', 
      borrar: 'Delete', 
      editar: 'Edit', 
      agregar: 'New Artwork', 
      pie: 'All Rights Reserved',
      // Menu Header
      menu_inicio: 'Home',
      menu_galeria: 'Gallery',
      menu_nosotros: 'About Us',
      menu_contacto: 'Contact',
      // Card Labels
      lbl_autor: 'Author',
      lbl_cat: 'Category',
      lbl_fecha: 'Date',
      // Footer
      ft_tit1: 'WHAT WILL YOU FIND?',
      ft_l1: 'Original Artworks',
      ft_l2: 'Emerging Artists',
      ft_l3: 'Virtual Exhibitions',
      ft_l4: 'Live Auctions',
      ft_tit2: 'FOLLOW US',
      ft_tit3: 'TELL US ABOUT YOUR PROJECT',
      ft_desc: 'Space for cultural dissemination and art sales.',
      ft_dir: '33 De las Artes St. Madrid, Spain',
      ft_aviso: 'Legal Notice',
      ft_priv: 'Privacy & Cookies'
    }
  };

  // --- DICCIONARIO PARA TRADUCIR CATEGORIAS DE LA BASE DE DATOS ---
  categoriasTraducidas: any = {
    'Naturaleza': 'Nature',
    'General': 'General',
    'Ciudad': 'City',
    'Paisaje': 'Landscape',
    'Retrato': 'Portrait',
    'Bodegón': 'Still Life',
    'Abstracto': 'Abstract',
    'Antigüedades': 'Antiques',
    'Marino': 'Seascape',
    'Arquitectura': 'Architecture'
  };

  ngOnInit() {
    this.firestoreService.getObras().subscribe(data => this.obras = data);
    this.firestoreService.user$.subscribe(user => this.usuario = user);
  }

  cambiarTema() { this.modoOscuro = !this.modoOscuro; }
  cambiarIdioma() { this.idioma = this.idioma === 'es' ? 'en' : 'es'; }
  login() { this.firestoreService.login(); }
  logout() { this.firestoreService.logout(); }

  // Función auxiliar para traducir la categoría si existe en el diccionario
  traducirCat(cat: string) {
    if (this.idioma === 'en' && this.categoriasTraducidas[cat]) {
      return this.categoriasTraducidas[cat];
    }
    return cat; // Si es español o no tiene traducción, devuelve la original
  }

  // CRUD (Sin cambios, solo para que funcione el archivo completo)
  nuevaObra() {
    if(!this.usuario) return;
    const titulo = prompt('Título:');
    const url = prompt('URL:', 'https://picsum.photos/300');
    if (titulo && url) {
      this.firestoreService.agregarObra({
        titulo, url, autor: this.usuario.displayName, 
        categoria: 'General', fecha: new Date().toISOString().split('T')[0]
      });
    }
  }
  editarObra(obra: Obra) {
    if(!this.usuario) return;
    const t = prompt('Nuevo título:', obra.titulo);
    if (t) this.firestoreService.actualizarObra(obra.id!, { titulo: t });
  }
  borrarObra(id: string) {
    if(!this.usuario) return;
    if(confirm('¿Borrar?')) this.firestoreService.borrarObra(id);
  }
}