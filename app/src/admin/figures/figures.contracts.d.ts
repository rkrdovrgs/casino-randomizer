interface IFigure {
    _id: string;
    name: string;
    eights: number;
    selected?: boolean;
    stats?: number;
    rueda: boolean;
    createdAt: Date;
    style: string;
}