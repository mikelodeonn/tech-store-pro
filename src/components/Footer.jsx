function Footer() {
    const anioActual = new Date().getFullYear();

    return(
        <footer className='pie-pagina' id='contacto'>
            <p>{anioActual} TechStore. Todos los derechos reservados.</p>
        </footer>
    )
}

export default Footer