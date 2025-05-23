
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import axios from "axios";

const initialNodes = [
  {
    id: "1",
    type: "default",
    position: { x: 0, y: 0 },
    data: { label: "Input", text: "Hello" },
    type: "Input",
  },
  {
    id: "2",
    position: { x: 250, y: 0 },
    data: { label: "Prompt", template: "Say this: {input}" },
    type: "Prompt",
  },
  { id: "3", position: { x: 500, y: 0 }, data: { label: "LLM" }, type: "LLM" },
  {
    id: "4",
    position: { x: 750, y: 0 },
    data: { label: "Output" },
    type: "Output",
  },
];

const initialEdges = [
  // { id: "e1-2", source: "1", target: "2" },
  // { id: "e2-3", source: "2", target: "3" },
  // { id: "e3-4", source: "3", target: "4" },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [result, setResult] = useState("");

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const runFlow = async () => {
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        data: n.data,
      })),
      edges,
    };

    const res = await axios.post("http://localhost:8000/run", payload);
    setResult(res.data.output.join("\n"));
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <button onClick={runFlow}>Run Flow</button>
      <pre>Output: {result}</pre>
    </div>
  );
}

export default App;
