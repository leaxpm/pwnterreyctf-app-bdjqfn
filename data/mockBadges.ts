
import { Badge } from '../types/Badge';

export const mockBadges: Badge[] = [
  {
    id: 'first-steps',
    name: 'Primeros Pasos',
    description: 'Completa tu perfil por primera vez',
    icon: 'person-add',
    color: '#4ECDC4',
    requirements: [
      {
        type: 'profile_complete',
        value: 1,
        description: 'Completa tu perfil con nombre, email y equipo'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'event-explorer',
    name: 'Explorador de Eventos',
    description: 'Asiste a tu primer evento',
    icon: 'calendar',
    color: '#45B7D1',
    requirements: [
      {
        type: 'events_attended',
        value: 1,
        description: 'Asiste a 1 evento'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'ctf-rookie',
    name: 'CTF Novato',
    description: 'Completa tu primer CTF',
    icon: 'flag',
    color: '#FF6B6B',
    requirements: [
      {
        type: 'ctfs_completed',
        value: 1,
        description: 'Completa 1 CTF'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'workshop-student',
    name: 'Estudiante de Talleres',
    description: 'Participa en 3 talleres',
    icon: 'school',
    color: '#FFD93D',
    requirements: [
      {
        type: 'workshops_taken',
        value: 3,
        description: 'Participa en 3 talleres'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'point-collector',
    name: 'Coleccionista de Puntos',
    description: 'Acumula 100 puntos',
    icon: 'trophy',
    color: '#9B59B6',
    requirements: [
      {
        type: 'points_earned',
        value: 100,
        description: 'Acumula 100 puntos'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'ctf-master',
    name: 'Maestro CTF',
    description: 'Completa 5 CTFs',
    icon: 'medal',
    color: '#E67E22',
    requirements: [
      {
        type: 'ctfs_completed',
        value: 5,
        description: 'Completa 5 CTFs'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'event-veteran',
    name: 'Veterano de Eventos',
    description: 'Asiste a 10 eventos',
    icon: 'star',
    color: '#2ECC71',
    requirements: [
      {
        type: 'events_attended',
        value: 10,
        description: 'Asiste a 10 eventos'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'knowledge-seeker',
    name: 'Buscador de Conocimiento',
    description: 'Participa en 10 talleres',
    icon: 'library',
    color: '#34495E',
    requirements: [
      {
        type: 'workshops_taken',
        value: 10,
        description: 'Participa en 10 talleres'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'social-butterfly',
    name: 'Mariposa Social',
    description: 'Conecta con la comunidad',
    icon: 'people',
    color: '#FF69B4',
    requirements: [
      {
        type: 'events_attended',
        value: 5,
        description: 'Asiste a 5 eventos diferentes'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Participa en eventos nocturnos',
    icon: 'moon',
    color: '#2C3E50',
    requirements: [
      {
        type: 'events_attended',
        value: 3,
        description: 'Asiste a 3 eventos nocturnos'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'speed-demon',
    name: 'Demonio de Velocidad',
    description: 'Completa CTFs rápidamente',
    icon: 'flash',
    color: '#F39C12',
    requirements: [
      {
        type: 'ctfs_completed',
        value: 3,
        description: 'Completa 3 CTFs rápidamente'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'team-player',
    name: 'Jugador de Equipo',
    description: 'Colabora en eventos de equipo',
    icon: 'people-outline',
    color: '#27AE60',
    requirements: [
      {
        type: 'events_attended',
        value: 7,
        description: 'Participa en eventos de equipo'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'crypto-master',
    name: 'Maestro Crypto',
    description: 'Domina la criptografía',
    icon: 'lock-closed',
    color: '#8E44AD',
    requirements: [
      {
        type: 'points_earned',
        value: 200,
        description: 'Gana 200 puntos en criptografía'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'forensics-expert',
    name: 'Experto Forense',
    description: 'Especialista en análisis forense',
    icon: 'search',
    color: '#16A085',
    requirements: [
      {
        type: 'workshops_taken',
        value: 5,
        description: 'Completa 5 talleres de forense'
      }
    ],
    isUnlocked: false
  },
  {
    id: 'web-warrior',
    name: 'Guerrero Web',
    description: 'Domina la seguridad web',
    icon: 'globe',
    color: '#3498DB',
    requirements: [
      {
        type: 'points_earned',
        value: 150,
        description: 'Gana 150 puntos en web'
      }
    ],
    isUnlocked: false
  }
];
