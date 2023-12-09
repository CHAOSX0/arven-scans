import { useState } from "react"

export default function SelectMenu({id, options: initialOptions}: {id: string, options: {text: string, value: string}[]}){
    const [options, setOptions] = useState<{text: String, value: string}[]>()
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const optionsElements = options?.map((e, i)=>(<option className={!isVisible ? 'hidden' : ''} value={e.value} key={i}>{e.text}</option>))
    return (
        <select
              id="input-tags"
              name="genres[]"
              multiple
              placeholder="Genres"
              autoComplete="off"
              tabIndex={-1}
              onFocus={()=>setIsVisible(true)}
              onBlur={()=>setIsVisible(false)}
              className="tomselected ts-hidden-accessible"
            >
             {optionsElements}
            </select>
    )
}