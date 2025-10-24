import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      reels: 'Reels',
      chat: 'Chat',
      profile: 'Profile',
      
      // Common
      search: 'Search',
      send: 'Send',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      loading: 'Loading...',
      
      // Home
      addStory: 'Add Story',
      likes: 'likes',
      comments: 'comments',
      
      // Profile
      tripsBooked: 'Trips Booked',
      saved: 'Saved',
      liked: 'Liked',
      appearance: 'Appearance',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      savedPosts: 'Saved Posts',
      quickActions: 'Quick Actions',
      savedDestinations: 'Saved Destinations',
      myBookings: 'My Bookings',
      settings: 'Settings',
      signOut: 'Sign Out',
      editProfile: 'Edit Profile',
      
      // Settings
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy',
      help: 'Help & Support',
      about: 'About',
      
      // Chat
      messages: 'Messages',
      searchConversations: 'Search conversations...',
      locals: 'Locals',
      tripPlanners: 'Trip Planners',
      typeMessage: 'Type a message...',
      
      // Post
      createPost: 'Create Post',
      addCaption: 'Add a caption...',
      addLocation: 'Add location...',
      uploadImage: 'Upload Image',
      post: 'Post',
      deletePost: 'Delete Post',
      deletePostConfirm: 'Are you sure you want to delete this post?',
      
      // Story
      deleteStory: 'Delete Story',
      deleteStoryConfirm: 'Are you sure you want to delete this story?',
      
      // Booking
      bookTrip: 'Book Trip',
      selectHotel: 'Select Hotel',
      guests: 'Guests',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      totalPrice: 'Total Price',
      bookNow: 'Book Now',
    }
  },
  es: {
    translation: {
      // Navigation
      home: 'Inicio',
      reels: 'Reels',
      chat: 'Chat',
      profile: 'Perfil',
      
      // Common
      search: 'Buscar',
      send: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      loading: 'Cargando...',
      
      // Home
      addStory: 'Añadir Historia',
      likes: 'me gusta',
      comments: 'comentarios',
      
      // Profile
      tripsBooked: 'Viajes Reservados',
      saved: 'Guardado',
      liked: 'Me Gusta',
      appearance: 'Apariencia',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
      savedPosts: 'Publicaciones Guardadas',
      quickActions: 'Acciones Rápidas',
      savedDestinations: 'Destinos Guardados',
      myBookings: 'Mis Reservas',
      settings: 'Configuración',
      signOut: 'Cerrar Sesión',
      editProfile: 'Editar Perfil',
      
      // Settings
      language: 'Idioma',
      notifications: 'Notificaciones',
      privacy: 'Privacidad',
      help: 'Ayuda y Soporte',
      about: 'Acerca de',
      
      // Chat
      messages: 'Mensajes',
      searchConversations: 'Buscar conversaciones...',
      locals: 'Locales',
      tripPlanners: 'Planificadores de Viajes',
      typeMessage: 'Escribe un mensaje...',
      
      // Post
      createPost: 'Crear Publicación',
      addCaption: 'Añadir descripción...',
      addLocation: 'Añadir ubicación...',
      uploadImage: 'Subir Imagen',
      post: 'Publicar',
      deletePost: 'Eliminar Publicación',
      deletePostConfirm: '¿Estás seguro de que quieres eliminar esta publicación?',
      
      // Story
      deleteStory: 'Eliminar Historia',
      deleteStoryConfirm: '¿Estás seguro de que quieres eliminar esta historia?',
      
      // Booking
      bookTrip: 'Reservar Viaje',
      selectHotel: 'Seleccionar Hotel',
      guests: 'Huéspedes',
      checkIn: 'Entrada',
      checkOut: 'Salida',
      totalPrice: 'Precio Total',
      bookNow: 'Reservar Ahora',
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      reels: 'Reels',
      chat: 'Chat',
      profile: 'Profil',
      
      // Common
      search: 'Rechercher',
      send: 'Envoyer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      loading: 'Chargement...',
      
      // Home
      addStory: 'Ajouter une Story',
      likes: 'j\'aime',
      comments: 'commentaires',
      
      // Profile
      tripsBooked: 'Voyages Réservés',
      saved: 'Enregistré',
      liked: 'Aimé',
      appearance: 'Apparence',
      theme: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
      savedPosts: 'Publications Enregistrées',
      quickActions: 'Actions Rapides',
      savedDestinations: 'Destinations Enregistrées',
      myBookings: 'Mes Réservations',
      settings: 'Paramètres',
      signOut: 'Se Déconnecter',
      editProfile: 'Modifier le Profil',
      
      // Settings
      language: 'Langue',
      notifications: 'Notifications',
      privacy: 'Confidentialité',
      help: 'Aide et Support',
      about: 'À Propos',
      
      // Chat
      messages: 'Messages',
      searchConversations: 'Rechercher des conversations...',
      locals: 'Locaux',
      tripPlanners: 'Planificateurs de Voyage',
      typeMessage: 'Tapez un message...',
      
      // Post
      createPost: 'Créer une Publication',
      addCaption: 'Ajouter une légende...',
      addLocation: 'Ajouter un lieu...',
      uploadImage: 'Télécharger une Image',
      post: 'Publier',
      deletePost: 'Supprimer la Publication',
      deletePostConfirm: 'Êtes-vous sûr de vouloir supprimer cette publication?',
      
      // Story
      deleteStory: 'Supprimer la Story',
      deleteStoryConfirm: 'Êtes-vous sûr de vouloir supprimer cette story?',
      
      // Booking
      bookTrip: 'Réserver un Voyage',
      selectHotel: 'Sélectionner un Hôtel',
      guests: 'Invités',
      checkIn: 'Arrivée',
      checkOut: 'Départ',
      totalPrice: 'Prix Total',
      bookNow: 'Réserver Maintenant',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
