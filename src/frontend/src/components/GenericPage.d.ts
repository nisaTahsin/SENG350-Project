import React from 'react';
import './GenericPage.css';
interface GenericPageProps {
    title: string;
    description: string;
    userType: 'staff' | 'registrar' | 'admin';
    children?: React.ReactNode;
}
declare const GenericPage: React.FC<GenericPageProps>;
export default GenericPage;
//# sourceMappingURL=GenericPage.d.ts.map