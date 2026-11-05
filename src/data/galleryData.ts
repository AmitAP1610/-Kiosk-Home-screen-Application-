export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'aerial' | 'academic' | 'facilities' | 'greenery' | 'events';
  src: string;
  alt: string;
}

export type GalleryCategory = 'all' | 'aerial' | 'academic' | 'facilities' | 'greenery' | 'events';

export interface GalleryCategoryTab {
  id: GalleryCategory;
  label: string;
  count: number;
}

export const SSU_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'aerial-1',
    title: 'Campus Aerial Overview',
    category: 'aerial',
    src: '/images/gallery/campus-aerial-overview.jpg',
    alt: 'Sri Sri University campus aerial overview'
  },
  {
    id: 'aerial-2',
    title: 'Panoramic Campus Hilltop View',
    category: 'aerial',
    src: '/images/gallery/campus-aerial-panoramic.jpg',
    alt: 'Panoramic hilltop view of Sri Sri University'
  },
  {
    id: 'entrance-1',
    title: 'Main Academic Entrance',
    category: 'academic',
    src: '/images/gallery/academic-entrance-g2.jpg',
    alt: 'Sri Sri University main academic entrance portal'
  },
  {
    id: 'academic-1',
    title: 'Shruti Academic Complex',
    category: 'academic',
    src: '/images/gallery/academic-shruti-complex.jpg',
    alt: 'Shruti Academic Complex facade and walkways'
  },
  {
    id: 'academic-2',
    title: 'University Academic Architecture',
    category: 'academic',
    src: '/images/gallery/academic-architecture.jpg',
    alt: 'Sri Sri University modern campus architecture'
  },
  {
    id: 'library-1',
    title: 'Central Library',
    category: 'academic',
    src: '/images/gallery/central-library.jpg',
    alt: 'Central Library interior and study spaces'
  },
  {
    id: 'classroom-1',
    title: 'Lecture Hall & Smart Classroom',
    category: 'academic',
    src: '/images/gallery/classroom-lab-session-1.jpg',
    alt: 'University lecture hall and classroom'
  },
  {
    id: 'classroom-2',
    title: 'Interactive Academic Classroom',
    category: 'academic',
    src: '/images/gallery/classroom-lab-session-2.jpg',
    alt: 'Interactive academic learning space'
  },
  {
    id: 'lab-1',
    title: 'Computing & Practical Laboratory',
    category: 'academic',
    src: '/images/gallery/laboratory-practical-3.jpg',
    alt: 'Practical research and computer laboratory'
  },
  {
    id: 'hostel-1',
    title: 'Halls of Residence',
    category: 'facilities',
    src: '/images/gallery/hostels-residence.jpg',
    alt: 'Sri Sri University student halls of residence'
  },
  {
    id: 'cafeteria-1',
    title: 'Vishwa Foods Dining & Cafeteria',
    category: 'facilities',
    src: '/images/gallery/cafeteria-vishwa-foods.jpg',
    alt: 'Vishwa Foods cafeteria and dining area'
  },
  {
    id: 'sports-1',
    title: 'Sports Grounds & Recreation Arena',
    category: 'facilities',
    src: '/images/gallery/sports-ground-facilities.jpg',
    alt: 'University sports field and athletics ground'
  },
  {
    id: 'amphitheatre-1',
    title: 'Campus Open-Air Amphitheatre',
    category: 'facilities',
    src: '/images/gallery/amphitheatre-g3.jpg',
    alt: 'Sri Sri University open-air amphitheatre'
  },
  {
    id: 'infra-1',
    title: 'University Campus Infrastructure',
    category: 'facilities',
    src: '/images/gallery/university-infrastructure-g6.jpg',
    alt: 'University campus infrastructure facilities'
  },
  {
    id: 'greenery-1',
    title: 'Lush Green Lawns & Flora',
    category: 'greenery',
    src: '/images/gallery/campus-greenery-lawns.jpg',
    alt: 'Lush green lawns and landscaped gardens'
  },
  {
    id: 'greenery-2',
    title: 'Scenic Campus Green Vista',
    category: 'greenery',
    src: '/images/gallery/campus-green-vista-g5.jpg',
    alt: 'Scenic green vista and natural surroundings'
  },
  {
    id: 'landscape-1',
    title: 'Campus Landscapes & Pathways',
    category: 'greenery',
    src: '/images/gallery/campus-landscape-g1.jpg',
    alt: 'Campus scenic landscape and stone walkways'
  },
  {
    id: 'studentlife-1',
    title: 'Campus Walkways & Student Life',
    category: 'greenery',
    src: '/images/gallery/student-life-g4.jpg',
    alt: 'Student life along campus green avenues'
  },
  {
    id: 'event-1',
    title: 'Annual Convocation Ceremony',
    category: 'events',
    src: '/images/gallery/convocation-celebration.jpg',
    alt: 'Sri Sri University annual convocation celebration'
  },
  {
    id: 'event-2',
    title: 'Academic Conference & ICE Day',
    category: 'events',
    src: '/images/gallery/university-events-ice-day.jpg',
    alt: 'University academic symposium and conference'
  },
  {
    id: 'event-3',
    title: 'University Cultural Gathering',
    category: 'events',
    src: '/images/gallery/university-gathering-event.jpg',
    alt: 'Sri Sri University student cultural celebration'
  }
];
