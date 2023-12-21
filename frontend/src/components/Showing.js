function Showing({ show, children }) {
    if (!show) {
      return null;
    }
    return (
      <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, paddingBottom: 100, paddingTop: 100, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="width2" style={{ height: 900, backgroundColor: 'white', padding: '1em'}}>
          {children}
        </div>
      </div>
    );
  }
  
  export default Showing;
  