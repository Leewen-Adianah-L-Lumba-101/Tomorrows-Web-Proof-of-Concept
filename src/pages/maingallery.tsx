import Navigator from '../components/Header'
import BackToTop from '../components/BacktoTop'
import { Link } from 'react-router-dom';

import React from 'react'
import ReactDOM from 'react-dom/client'
import EmblaCarousel from '../components/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'

// Create constants to adjust carousel container's settings
const OPTIONS: EmblaOptionsType = { dragFree: false }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const Carousel: React.FC = () => (
  <>
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
  </>
)

export function Gallery() {
  return (
    <div className="">
        <Navigator/>
        <div className="headinggallery">
          <h1>Public Gallery</h1>
        </div>
        <Carousel/>
    </div>
  )
}

export default Gallery;