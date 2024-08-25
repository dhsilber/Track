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

const enum Pain {
  Ache = "Ache",
  Pain = "Pain",
  Burning = "Burning",
  Sharp = "Sharp",
  Other = "Other",
}

interface Track {
  timestamp: number
  painLevel: number
  side: Side
  part: Part
  pain: Pain[]
}

interface TrackGroup {
  tracked: Track[]
}

const defaultTrackData: TrackGroup = {
  tracked: []
}

function App() {
  const [painLevel, setPainLevel ] = useState(0)
  const [side, setSide ] = useState<Side>(Side.Unknown)
  const [part, setPart ] = useState<Part>(Part.Unknown)
  const [pain, setPain ] = useState<Set<Pain>>(new Set)
  const [getStorage, setStorage] = useLocalStorageState("track1", {
    defaultValue: defaultTrackData
  })

  function addPain(painValue: Pain) {
    setPain(new Set(pain).add(painValue))
  }

  function removePain(painValue: Pain) {
    const hurts = new Set(pain)
    hurts.delete(painValue)
    setPain(hurts)
  }

  function togglePain(painValue: Pain) {
    pain.has(painValue) ? removePain(painValue) : addPain(painValue)
  }

  function store() {
    const data = getStorage

    data.tracked.unshift( { 
      timestamp: Date.now(),
      painLevel: painLevel,
      side: side,
      part: part,
      pain: Array.from(pain),
     })
    setStorage( data )
  }

  function format(item: Track): string {
    const date = new Date(item.timestamp)
    const month = date.toLocaleString('en-us', {month:'short'})
    const time = `${(date.getHours()+"").padStart(2,'0')}:${(date.getMinutes()+"").padStart(2,'0')}`
    const timestamp = `${month} ${date.getDate()} ${time}`
    const painString = item.pain.join( ', ' )
    const rest = `Pain: ${item.painLevel} - ${item.side} ${item.part} - ${painString}`
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
      {Part.Back !== part && <form>
        <label>
          <input type={'checkbox'} checked={Side.Left == side} onClick={()=>setSide(Side.Left === side ? Side.Unknown : Side.Left)}/>
          Left
        </label>
        <label>
          <input type={'checkbox'} checked={Side.Right == side} onClick={()=>setSide(Side.Right === side ? Side.Unknown : Side.Right)}/>
          Right
        </label>
        <label>
          <input type={'checkbox'} checked={Side.Both == side} onClick={()=>setSide(Side.Both === side ? Side.Unknown : Side.Both)}/>
          Both
        </label>
      </form>}
      {Part.Back === part && <div>Only</div>}
      <form>
        <label>
          <input type={'checkbox'} checked={pain.has(Pain.Ache)} onClick={()=>{togglePain(Pain.Ache)}} />
          Ache
        </label>
        <label>
          <input type={'checkbox'} checked={pain.has(Pain.Pain)} onClick={()=>{togglePain(Pain.Pain)}} />
          Pain
        </label>
        <label>
          <input type={'checkbox'} checked={pain.has(Pain.Burning)} onClick={()=>{togglePain(Pain.Burning)}} />
          Burning
        </label>
        <label>
          <input type={'checkbox'} checked={pain.has(Pain.Sharp)} onClick={()=>{togglePain(Pain.Sharp)}} />
          Sharp
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
