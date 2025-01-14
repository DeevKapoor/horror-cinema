'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import PageLayout from '../components/PageLayout'

interface Experience {
  id: number
  title: string
  description: string
  imagePath: string
}

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Virtual Reality Haunted House',
    description: 'Experience the terror of a haunted house from the comfort of your own home with our state-of-the-art VR technology.',
    imagePath: '/img1.jpeg',
  },
  {
    id: 2,
    title: '4D Horror Movie Screenings',
    description: 'Feel every scare with our 4D screenings, complete with moving seats, wind effects, and more!',
    imagePath: '/img.webp',
  },
  {
    id: 3,
    title: 'Live Action Horror Escape Room',
    description: 'Can you solve the puzzles and escape the room before the monsters get you? Test your wits in our live action horror escape rooms.',
    imagePath: '/img3.jpeg',
  },
]

export default function ExperiencesPage() {
  return (
    <PageLayout title="Immersive Horror Experiences">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={experience.imagePath}
              alt={experience.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-nosifer text-xl text-red-600 mb-2">{experience.title}</h3>
              <p className="text-gray-300">{experience.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  )
}
