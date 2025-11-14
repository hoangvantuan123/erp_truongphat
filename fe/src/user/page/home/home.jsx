import { useState, useEffect } from 'react'
import { Button, Flex } from 'antd'
import { Helmet } from 'react-helmet'

const Home = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  )
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date()
      setTime(
        currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
      setDate(currentDate.toLocaleDateString())
    }, 60000)

    const hours = new Date().getHours()
    if (hours < 12) {
      setGreeting('Good Morning')
    } else if (hours < 18) {
      setGreeting('Good Afternoon')
    } else {
      setGreeting('Good Evening')
    }

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="bg-slate-50 p-3 h-screen overflow-auto md:h-full md:overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-5 md:gap-4 h-full ">
          <div className="col-start-1 col-end-6 row-start-1 justify-center items-center row-end-6 bg-white border text-gray-950 w-full min-h-[100px] rounded-lg flex flex-col p-4">
            <h1 className="text-6xl font-medium">{time}</h1>
            <p className="text-2xl">{date}</p>
            <p className="text-2xl">{greeting}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
