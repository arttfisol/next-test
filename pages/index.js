import { useState, useEffect } from 'react'
import HotalContainer from '../components/hotelContainer'
import SkeletonHotelContainer from '../components/skeleton/hotelContainer'
import mockHotel from '../json/hotel.json'

export default function Pages () {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = 2.5 * 1000 // 2.5sec
    setTimeout(() => {
      setLoading(false)
    }, timeout)
  }, [])

  return (
    <div className='App'>
      {loading
        ? (<SkeletonHotelContainer />)
        : (
          <HotalContainer
            name={mockHotel[0].name}
            location={mockHotel[0].location}
            detail={mockHotel[0].detail}
            price={mockHotel[0].price}
          />
          )}
    </div>
  )
}
