import { useState } from 'react'
import './App.css'
import { Slider } from 'rsuite'
import useLocalStorageState from 'use-local-storage-state'

const enum Side {
  Unknown = "Unknown",
  Left = "Left",
  Right = "Right",
  Both = "Both",
  Only = "Only",
}

const enum Part {
  Unknown = "Unknown",
  Shoulder = "Shoulder",
  Knee = "Knee",
  Back = "Back",
}

interface Track {
  timestamp: number
  painLevel: number
  side: Side
  part: Part
}

interface TrackSet {
  tracked: Track[]
}

const defaultTrackData: TrackSet = {
  tracked: [
      { 
        timestamp: 0,
        painLevel: 0,
        side: Side.Unknown,
        part: Part.Unknown,
      },
  ]
}

function App() {
  const [painLevel, setPainLevel ] = useState(0)
  const [side, setSide ] = useState<Side>(Side.Unknown)
  const [part, setPart ] = useState<Part>(Part.Unknown)
  const [getStorage, setStorage] = useLocalStorageState("track", {
    defaultValue: defaultTrackData
  })

  function store() {
    let data = getStorage
    data.tracked.unshift( { 
      timestamp: Date.now(),
      painLevel: painLevel,
      side: side,
      part: part,
     })
    setStorage( data )
  }

  function format(item: Track): string {
    const date = new Date(item.timestamp)
    const month = date.toLocaleString('en-us', {month:'short'})
    const time = `${(date.getHours()+"").padStart(2,'0')}:${(date.getMinutes()+"").padStart(2,'0')}`
    const timestamp = `${month} ${date.getDate()} ${time}`
    const rest = `Pain: ${item.painLevel} - ${item.side} ${item.part}`
    return `${timestamp} - ${rest}`
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
      <div style={{}}>
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
      {Part.Back !== part && <form>
        <label>
          <input type={'checkbox'} checked={Side.Left == side} onClick={()=>setSide(Side.Left === side ? Side.Unknown : Side.Left)}/>
          Left
        </label>
        <label>
          <input type={'checkbox'} checked={Side.Right == side} onClick={()=>setSide(Side.Right === side ? Side.Unknown : Side.Right)}/>
          Right
        <label>
          <input type={'checkbox'} checked={Side.Both == side} onClick={()=>setSide(Side.Both === side ? Side.Unknown : Side.Both)}/>
          Both
        </label>
        </label>
      </form>}
      {Part.Back === part && <div>Only</div>}
      <form>
        <label>
          <input type={'checkbox'} checked={Part.Back == part} onClick={()=>{
            setSide(Part.Back === part ? Side.Unknown : Side.Only)
            setPart(Part.Back === part ? Part.Unknown : Part.Back)
          }} />
          Back
        </label>
        <label>
          <input type={'checkbox'} checked={Part.Shoulder == part} onClick={()=>setPart(Part.Shoulder === part ? Part.Unknown : Part.Shoulder)}/>
          Shoulder
        </label>
        <label>
          <input type={'checkbox'} checked={Part.Knee == part} onClick={()=>setPart(Part.Knee === part ? Part.Unknown : Part.Knee)}/>
          Knee
        </label>
      </form>
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
