import React, { ReactChild } from 'react';
import { Card, CardType } from './constants_funcs';

export interface CurrentCardProps {
    card: Card,
    children?: ReactChild;
}

const DrawnCard: React.FC<CurrentCardProps> = (props) => {
    if (!props.card) { return (<div></div>); }
    
    let count = 1;
    let type = props.card.type;

    if (type.startsWith("double")) {
        type = type.split('double-')[1] as CardType;
        count++;
    }

    function cardBlock(color: string, count = 1) {
        const children: ReactChild[] = [];
        const cardBlock: string = `block-${color}`;
        for (let i=0; i<count; i++) {
            children.push((<span key={i} className={cardBlock}></span>))
        }
        return (<div className="card">{children}</div>);
    }


    return props.card
        ? (cardBlock(type, count))
        : (<></>);
};

export default DrawnCard;