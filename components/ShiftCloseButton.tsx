import moment from "moment";
import { useEffect, useState } from "react";

type ShiftButtonClose = {
    close: (id: string) => void;
    start: Date
    id: string
}

const ShiftCloseButton : React.FC<ShiftButtonClose> = (props) => {

    const { close, start, id } = props;
    const [ms, setMs] = useState(() => {
        return moment(new Date()).diff(start);
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setMs(ms + 1000)
        }, 1000); // 1 sec. not a real second its depends but close enough

        return () => clearTimeout(timer)
    }, [ms])  

    const closeShift = async () : Promise<void> => {
        await fetch('/api/shift', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  
                id
            })
        }).then(res => close(id));
    }



    return (
        <div>
            <h2>Active Shift Id <span>{id}</span></h2>
            <div>{moment.utc(ms).format('HH:mm:ss')}</div>
            <div>
                <button style={{'color' : 'red'}} onClick={() => closeShift()}>Close Shift</button>
            </div>
        </div>
    )
}

export default ShiftCloseButton