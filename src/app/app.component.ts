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

  // Estado inicial
  modoOscuro = false;
  idioma = 'es'; // 'es' para Español, 'en' para Inglés

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

  // --- DICCIONARIO PARA TRADUCIR CATEGORIAS ---
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
    // 1. Nos suscribimos a la lista de obras
    this.firestoreService.getObras().subscribe(data => this.obras = data);
    
    // 2. Nos suscribimos al estado del usuario (Login/Logout)
    this.firestoreService.user$.subscribe(user => this.usuario = user);
  }

  // --- FUNCIONES VISUALES ---
  cambiarTema() { this.modoOscuro = !this.modoOscuro; }
  cambiarIdioma() { this.idioma = this.idioma === 'es' ? 'en' : 'es'; }
  
  login() { this.firestoreService.login(); }
  logout() { this.firestoreService.logout(); }

  // Función auxiliar para traducir la categoría de la DB
  traducirCat(cat: string) {
    // Si estamos en inglés y existe la traducción, la usa. Si no, devuelve la original.
    if (this.idioma === 'en' && this.categoriasTraducidas[cat]) {
      return this.categoriasTraducidas[cat];
    }
    return cat;
  }

  // --- FUNCIONES CRUD (Base de Datos) ---
  nuevaObra() {
    if(!this.usuario) return;
    const titulo = prompt('Título de la obra:');
    const url = prompt('URL de la imagen:', 'https://picsum.photos/300');
    
    if (titulo && url) {
      const nueva: Obra = {
        titulo, url, autor: this.usuario.displayName, 
        categoria: 'General', fecha: new Date().toISOString().split('T')[0]
      };
      this.firestoreService.agregarObra(nueva);
    }
  }

  editarObra(obra: Obra) {
    if(!this.usuario) return;
    const nuevoTitulo = prompt('Nuevo título:', obra.titulo);
    if (nuevoTitulo) {
      this.firestoreService.actualizarObra(obra.id!, { titulo: nuevoTitulo });
    }
  }

  borrarObra(id: string) {
    if(!this.usuario) return;
    if(confirm('¿Seguro que deseas eliminar esta obra?')) {
      this.firestoreService.borrarObra(id);
    }
  }
}