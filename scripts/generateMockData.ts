
import { Badge } from '../types/Badge';
import { Event } from '../types/Event';

// Función para generar badges adicionales
export const generateAdditionalBadges = (): Badge[] => {
  return [
    {
      id: 'social-butterfly',
      name: 'Mariposa Social',
      description: 'Conecta con 5 participantes diferentes',
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
      description: 'Participa en eventos después de las 8 PM',
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
      description: 'Completa un CTF en menos de 2 horas',
      icon: 'flash',
      color: '#F39C12',
      requirements: [
        {
          type: 'ctfs_completed',
          value: 1,
          description: 'Completa 1 CTF rápidamente'
        }
      ],
      isUnlocked: false
    },
    {
      id: 'team-player',
      name: 'Jugador de Equipo',
      description: 'Participa en 3 eventos de equipo',
      icon: 'people-outline',
      color: '#27AE60',
      requirements: [
        {
          type: 'events_attended',
          value: 3,
          description: 'Participa en eventos de equipo'
        }
      ],
      isUnlocked: false
    },
    {
      id: 'crypto-master',
      name: 'Maestro Crypto',
      description: 'Resuelve 10 retos de criptografía',
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
    }
  ];
};

// Función para generar eventos adicionales
export const generateAdditionalEvents = (): Event[] => {
  return [
    {
      id: '9',
      title: 'CTF: Ingeniería Social',
      organizer: 'Equipo Pwnterrey',
      type: 'CTF',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Laboratorio 1',
      description: 'Retos enfocados en técnicas de ingeniería social y OSINT. Aprende a recopilar información de fuentes públicas.',
      date: 'Lunes, 18 Abril',
      isFavorite: false,
    },
    {
      id: '10',
      title: 'Taller: Desarrollo Seguro',
      organizer: 'Patricia González',
      type: 'Taller',
      startTime: '09:00',
      endTime: '11:00',
      location: 'Laboratorio 3',
      description: 'Mejores prácticas para desarrollar aplicaciones seguras desde el inicio. Incluye revisión de código y testing.',
      date: 'Lunes, 18 Abril',
      isFavorite: false,
    },
    {
      id: '11',
      title: 'Red Team vs Blue Team',
      organizer: 'Equipo Pwnterrey',
      type: 'CTF',
      startTime: '13:00',
      endTime: '17:00',
      location: 'Laboratorio Principal',
      description: 'Simulacro de ataque y defensa en tiempo real. Los equipos rojos atacan mientras los azules defienden.',
      date: 'Martes, 19 Abril',
      isFavorite: false,
    },
    {
      id: '12',
      title: 'Blockchain y Criptomonedas',
      organizer: 'Dr. Fernando Ruiz',
      type: 'Charla',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Auditorio',
      description: 'Introducción a la seguridad en blockchain y análisis de vulnerabilidades en smart contracts.',
      date: 'Martes, 19 Abril',
      isFavorite: false,
    },
    {
      id: '13',
      title: 'Taller: Bug Bounty Hunting',
      organizer: 'Luis Hernández',
      type: 'Taller',
      startTime: '15:00',
      endTime: '17:00',
      location: 'Laboratorio 2',
      description: 'Aprende a encontrar vulnerabilidades en aplicaciones web y cómo reportarlas responsablemente.',
      date: 'Martes, 19 Abril',
      isFavorite: false,
    },
    {
      id: '14',
      title: 'CTF: Reverse Engineering',
      organizer: 'Equipo Pwnterrey',
      type: 'CTF',
      startTime: '11:00',
      endTime: '15:00',
      location: 'Laboratorio 1',
      description: 'Retos de ingeniería inversa con binarios de diferentes arquitecturas. Nivel avanzado.',
      date: 'Miércoles, 20 Abril',
      isFavorite: false,
    },
    {
      id: '15',
      title: 'Taller: Incident Response',
      organizer: 'María Elena Castro',
      type: 'Taller',
      startTime: '09:00',
      endTime: '12:00',
      location: 'Laboratorio 3',
      description: 'Procedimientos para responder a incidentes de seguridad. Incluye análisis de logs y contención.',
      date: 'Miércoles, 20 Abril',
      isFavorite: false,
    },
    {
      id: '16',
      title: 'Seguridad en la Nube',
      organizer: 'Ing. Ricardo Morales',
      type: 'Charla',
      startTime: '14:00',
      endTime: '15:30',
      location: 'Sala Principal',
      description: 'Mejores prácticas de seguridad para servicios en la nube. AWS, Azure y Google Cloud.',
      date: 'Miércoles, 20 Abril',
      isFavorite: false,
    }
  ];
};

// Función para generar estadísticas de usuario de ejemplo
export const generateSampleUserStats = () => {
  return {
    eventsAttended: Math.floor(Math.random() * 15) + 1,
    ctfsCompleted: Math.floor(Math.random() * 8) + 1,
    workshopsTaken: Math.floor(Math.random() * 12) + 1,
    pointsEarned: Math.floor(Math.random() * 500) + 50,
    profileComplete: Math.random() > 0.3, // 70% chance of complete profile
  };
};

// Función para simular progreso de usuario
export const simulateUserProgress = (currentStats: any) => {
  return {
    eventsAttended: currentStats.eventsAttended + 1,
    ctfsCompleted: currentStats.ctfsCompleted + (Math.random() > 0.7 ? 1 : 0),
    workshopsTaken: currentStats.workshopsTaken + (Math.random() > 0.5 ? 1 : 0),
    pointsEarned: currentStats.pointsEarned + Math.floor(Math.random() * 50) + 10,
    profileComplete: true,
  };
};

console.log('Mock data generators ready!');
