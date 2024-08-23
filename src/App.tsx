import { useState } from 'react'
import './App.css'
import { Slider } from 'rsuite'
import useLocalStorageState from 'use-local-storage-state'


interface Track {
  timestamp: number
  painLevel: number
}

interface TrackSet {
  tracked: Track[]
}

const defaultTrackData: TrackSet = {
  tracked: [
      { 
        timestamp: 0,
        painLevel: 0
     },
  ]
}

function App() {
  const [painLevel, setPainLevel ] = useState(0)
  const [getStorage, setStorage] = useLocalStorageState("track", {
    defaultValue: defaultTrackData
  })

  function store() {
    let data = getStorage
    data.tracked.unshift( { 
      timestamp: Date.now(),
      painLevel: painLevel,
     })
    setStorage( data )
  }

  function format(item: Track): string {
    const date = new Date(item.timestamp)
    return `${date.getUTCMonth()} ${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()} - Pain: ${item.painLevel}`
  }

  function allData(): string {
    const all: string[] = []
    getStorage.tracked.forEach(item => {
      const line = format(item)
      all.push(line)
    })

    return all.join('\n')
  }

  return (
    <>
      <h1>Track</h1>
      <div>
        <div style={{ height: 300 }}>
          <Slider
            defaultValue={0}
            min={1}
            step={1}
            max={10}
            graduated
            vertical
            renderMark={mark => {
              return <span>{mark}</span>;
            }}
            onChange = {(value: number) => setPainLevel(value)}
          />
        </div>
      </div>
      <div className="card">
        <button onClick={() => store()}>
          Track
        </button>
      </div>
      
      <textarea
        rows={50} cols={77}
        value={allData()}
        style={{color: 'black'}}
    >
        {allData()}
      </textarea>
    </>
  )
}

export default App
