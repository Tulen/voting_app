import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8090);

  // publishing whole state whenever any changes occur could be optimized (sending relevant subsets, diffs)

  // subscribes listener to store, reads current state, converts to POJO, emits state event
  // result = JSON-serialized snapshot of state sent over all active socket.io connections

  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );

  // emit current state when client connects
  // be able to receive updates from clients: accepting remote actions to store
  // security consideration: accepting any client actions. real world = firewall / auth mech.
  io.on('connection', socket => {
    socket.emit('state', store.getState().toJs());
    socket.on('action', store.dispatch.bind(store));
  });

}