import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import moment from 'moment';
import ShiftCreateButton from "./ShiftCreateButton";
import ShiftCloseButton from "./ShiftCloseButton";

export type Shift = {
    id: string;
    start: Date;
    complete: boolean;
    user_id: string;
    lat: number;
    lng: number;
}


const ShiftList : React.FC = () => {
    const { data : session } = useSession();
    const [ shifts, setShifts ] = useState<Shift[]>([]);

    const fetchShift = async () : Promise<Shift[]> => {
        return await fetch('/api/shift').then(res => res.json());
    }

  
    useEffect(() => {
        fetchShift().then(setShifts);
    }, [])

    useEffect(() => { 
        console.log('change');
        
    }, [shifts])

    const createShift = (shift: Shift) : void => {               
        setShifts([...shifts, shift]);
    }

    const closeShift = (id: string) : void => {
        const list = shifts.map(shift => {
            if (shift.id === id) {
                return { ...shift, complete: true };
            }

            return shift;
        })

        setShifts(list)
    }

    const lastShift = () : Shift | undefined => {
        return shifts.at(-1);
    }

    if (!session?.user?.email) {
        return <div></div>
    }
    //understand i cant render object.....

    const showList = () : JSX.Element => {
        return (
            <div>
                <h2>Shift list</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>#</th>
                            <th>id</th>
                            <th>start</th>
                            <th>complete</th>
                            <th>location</th>
                        </tr>
                        {shifts.map((shift, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ 'textAlign': 'center', 'padding': '6px' }}>{ i + 1 }</td>
                                    <td style={{ 'textAlign': 'center','padding': '6px' }}>{ shift.id}</td>
                                    <td style={{ 'textAlign': 'center','padding': '6px' }}>{ moment(shift.start).format('MMMM Do YYYY h:mm:ss a')}</td>
                                    <td style={{ 'textAlign': 'center','padding': '6px' }}>{shift.complete ? 'Yes' : 'No'}</td>
                                    <td style={{ 'textAlign': 'center','padding': '6px' }}>{JSON.stringify({lat: shift.lat, lng: shift.lng})}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    const showCreate = (email: string) : JSX.Element | null => {
        if(lastShift()?.complete) {
            return <ShiftCreateButton email={email} create={createShift} />
        }
        return null;
    }

    const showClose = () : JSX.Element | null => {
        const last = lastShift();
        if(last && !last.complete) {
            return <ShiftCloseButton id={last.id} close={closeShift} start={last.start}></ShiftCloseButton>
        }
        return null
    }

    if(!session?.user?.email) {
        return <div></div>
    }

    return (
        <div>
            {showList()}
            {showCreate(session.user.email)}
            {showClose()}
        </div>
    )
}   

export default ShiftList