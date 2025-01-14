'use client';

import { motion } from 'framer-motion';
import PageLayout from '../components/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout title="About Horror Cinema">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-gray-300 mb-6">
          Welcome, brave soul, to Horror Cinema—where the shadows writhe, whispers echo in the dark, and nightmares are born. We exist not merely to entertain but to awaken the primal fears that lurk within us all. From cursed classics to sinister new tales, our realm is one of unrelenting terror.
        </p>
        <p className="text-lg text-gray-300 mb-6">
          Here, horror is not just a genre; it&rsquo;s a way of life. Explore our lair of terrifying treasures: reviews penned in blood, trailers of cursed films, and immersive experiences that blur the line between fiction and your deepest fears. Do you dare tread further?
        </p>
        <p className="text-lg text-gray-300 mb-6">
          Horror Cinema was conjured from the dark recesses of Deevanshu Kapoor&rsquo;s imagination. A passionate creator and developer, Deevanshu&rsquo;s vision brings this twisted domain to life. Follow his journey—or perhaps his descent—into darkness on GitHub:
          <br />
          <a
            href="https://github.com/DeevKapoor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline"
          >
            github.com/DeevKapoor
          </a>
        </p>
        <p className="text-lg text-gray-300">
          Remember, the real horror is yet to come. Welcome to the darkness. Welcome to Horror Cinema.
        </p>
      </motion.div>
    </PageLayout>
  );
}
