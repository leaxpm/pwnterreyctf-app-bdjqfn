
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
  }
];
