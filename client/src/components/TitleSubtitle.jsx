const TitleSubtitle = ({title, subtitle}) => {
    return (
        <div className="text-center mb-8">
            <h1 className="font-bold text-2xl tracking-tight mb-2">{title}</h1>
            <p className="font-medium text-lead-gray">{subtitle}</p>
        </div>
    );
};

export default TitleSubtitle;