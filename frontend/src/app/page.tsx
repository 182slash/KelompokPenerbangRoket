'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import useSWR from 'swr';
import { albumsApi, eventsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/index';
import { formatEventDateShort, formatIDR } from '@/lib/utils';
import { staggerContainer, staggerItem, fadeInUp, letterReveal } from '@/lib/motion';
import BackgroundHero from '@/components/sections/BackgroundHero';

const BAND_NAME_LINE1 = 'KELOMPOK';
const BAND_NAME_LINE2 = 'PENERBANG';
const BAND_NAME_LINE3 = 'ROKET';

function HeroLetters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="flex overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterReveal}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const { data: albumsRes } = useSWR('albums', () => albumsApi.list());
  const { data: eventsRes } = useSWR('events-upcoming', () =>
    eventsApi.list({ upcoming: true, limit: 3 })
  );

  const albums = albumsRes?.data ?? [];
  const latestAlbum = albums[0];
  const upcomingEvents = eventsRes?.data ?? [];

  return (
    <>
      {/* ─── HERO ─── */}
      <BackgroundHero />

      {/* ─── LATEST RELEASE ─── */}
      {latestAlbum && (
        <section
          id="latest-release"
          className="section-pad border-t border-accent-dim/20"
        >
          <div className="container-kpr">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Album art */}
              <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute inset-0 bg-accent/10 rounded-card blur-2xl scale-90 group-hover:bg-accent/15 transition-all duration-500" />
                <div className="relative aspect-square max-w-md mx-auto">
                  <Image
                    src={latestAlbum.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80'}
                    alt={`${latestAlbum.title} album cover`}
                    fill
                    className="object-cover rounded-card border border-accent-dim/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 rounded-card ring-1 ring-accent/20" />
                </div>
              </motion.div>

              {/* Info */}
              <motion.div variants={staggerContainer} className="flex flex-col gap-6">
                <motion.p variants={staggerItem} className="eyebrow">
                  Latest Release
                </motion.p>
                <motion.h2
                  variants={staggerItem}
                  className="font-display text-display text-text-primary"
                >
                  {latestAlbum.title}
                </motion.h2>
                <motion.p
                  variants={staggerItem}
                  className="font-mono text-text-muted text-sm"
                >
                  {latestAlbum.releaseYear} · Kelompok Penerbang Roket
                </motion.p>
                {latestAlbum.description && (
                  <motion.p
                    variants={staggerItem}
                    className="text-text-secondary leading-relaxed"
                  >
                    {latestAlbum.description}
                  </motion.p>
                )}
                <motion.div
                  variants={staggerItem}
                  className="flex flex-wrap gap-3"
                >
                  {latestAlbum.spotifyUrl && (
                    <Button
                      href={latestAlbum.spotifyUrl}
                      external
                      variant="primary"
                      size="md"
                    >
                      Spotify
                    </Button>
                  )}
                  {latestAlbum.bandcampUrl && (
                    <Button
                      href={latestAlbum.bandcampUrl}
                      external
                      variant="outline"
                      size="md"
                    >
                      Bandcamp
                    </Button>
                  )}
                  {latestAlbum.youtubeMusicUrl && (
                    <Button
                      href={latestAlbum.youtubeMusicUrl}
                      external
                      variant="ghost"
                      size="md"
                    >
                      YouTube Music
                    </Button>
                  )}
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Button
                    href="/discography"
                    variant="ghost"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Full Discography
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── UPCOMING EVENTS STRIP ─── */}
      {upcomingEvents.length > 0 && (
        <section className="section-pad bg-bg-surface border-y border-accent-dim/20">
          <div className="container-kpr">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <div className="flex items-end justify-between mb-10">
                <motion.div variants={fadeInUp}>
                  <p className="eyebrow mb-2">On Stage</p>
                  <h2 className="font-display text-4xl text-text-primary">
                    UPCOMING SHOWS
                  </h2>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button
                    href="/events"
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    All Shows
                  </Button>
                </motion.div>
              </div>

              <div className="flex flex-col divide-y divide-accent-dim/20">
                {upcomingEvents.map((event) => {
                  const d = formatEventDateShort(event.eventDate);
                  return (
                    <motion.div
                      key={event.id}
                      variants={staggerItem}
                      className="flex items-center gap-6 py-5 group"
                    >
                      {/* Date block */}
                      <div className="shrink-0 w-14 text-center">
                        <p className="font-display text-3xl text-accent-bright leading-none">
                          {d.day}
                        </p>
                        <p className="font-mono text-xs text-text-muted uppercase">
                          {d.month} {d.year}
                        </p>
                      </div>

                      <div className="w-px h-10 bg-accent-dim/40 shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-text-primary text-lg truncate group-hover:text-accent-bright transition-colors duration-200">
                          {event.title}
                        </p>
                        <p className="font-mono text-xs text-text-muted truncate">
                          {event.venue} · {event.city}
                        </p>
                      </div>

                      <Badge
                        label={event.status.replace('_', ' ')}
                        status={event.status}
                        variant="status"
                      />

                      {event.ticketUrl && event.status === 'upcoming' && (
                        <Button
                          href={event.ticketUrl}
                          external
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                        >
                          Tickets
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── MERCH TEASER ─── */}
      <section className="section-pad">
        <div className="container-kpr text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="max-w-2xl mx-auto"
          >
            <motion.p variants={staggerItem} className="eyebrow mb-4">
              Official Store
            </motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display text-display text-text-primary mb-6"
            >
              GEAR UP
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-text-secondary mb-10 leading-relaxed"
            >
              T-shirts, posters, accessories — semua official KPR merch tersedia
              di sini.
            </motion.p>
            <motion.div variants={staggerItem}>
              <Button
                href="/merch"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                Shop Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}