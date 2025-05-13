
# Simulated node functions
def input_node(params, _): return params['text']
def prompt_node(params, inputs): return params['template'].replace("{input}", inputs[0])
def llm_node(params, inputs): return f"Simulated LLM response to: {inputs[0]}"
def output_node(params, inputs): return inputs[0]

# Node type map
NODE_FUNCTIONS = {
    "Input": input_node,
    "Prompt": prompt_node,
    "LLM": llm_node,
    "Output": output_node,
}

def execute_flow(data):
    nodes = {node['id']: node for node in data['nodes']}
    edges = data['edges']
    
    # Build adjacency + reverse map
    forward = {node_id: [] for node_id in nodes}
    reverse = {node_id: [] for node_id in nodes}
    for edge in edges:
        src = edge['source']
        tgt = edge['target']
        forward[src].append(tgt)
        reverse[tgt].append(src)

    results = {}
    
    def resolve(node_id):
        if node_id in results:
            return results[node_id]
        node = nodes[node_id]
        inputs = [resolve(parent) for parent in reverse[node_id]]
        func = NODE_FUNCTIONS[node['type']]
        result = func(node.get('data', {}), inputs)
        results[node_id] = result
        return result

    # Start from Output nodes
    output_nodes = [n['id'] for n in nodes.values() if n['type'] == 'Output']
    return [resolve(nid) for nid in output_nodes]
