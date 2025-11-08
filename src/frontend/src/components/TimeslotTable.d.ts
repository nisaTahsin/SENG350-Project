import React from 'react';
interface BookingCell {
    label: string;
    span: number;
}
interface TimeslotTableProps {
    times: string[];
    rooms: string[];
    bookings: {
        [room: string]: {
            [time: string]: string | BookingCell;
        };
    };
}
declare const TimeslotTable: React.FC<TimeslotTableProps>;
export default TimeslotTable;
//# sourceMappingURL=TimeslotTable.d.ts.map