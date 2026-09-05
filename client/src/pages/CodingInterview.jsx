import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Go', 'Rust', 'Swift'];
const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist'];

const STARTER_CODE = {
  JavaScript: `// Write your solution here
function solution(input) {
  // Your code here
  
  return result;
}`,
  Python: `# Write your solution here
def solution(input):
    # Your code here
    
    return result`,
  Java: `// Write your solution here
public class Solution {
    public static Object solution(Object input) {
        // Your code here
        
        return result;
    }
}`,
  TypeScript: `// Write your solution here
function solution(input: any): any {
  // Your code here
  
  return result;
}`,
  'C++': `// Write your solution here
#include <bits/stdc++.h>
using namespace std;

auto solution(auto input) {
    // Your code here
    
    return result;
}`
};

export default function CodingInterview() {
  const [config, setConfig] = useState({ role: 'Software Engineer', difficulty: 'Medium', language: 'JavaScript' });
  const [phase, setPhase] = useState('setup'); // setup | coding | result
  const [problem, setProblem] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const generateProblem = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/coding/problem', config);
      setProblem(data.problem);
      setSessionId(data.sessionId);
      setCode(STARTER_CODE[config.language] || STARTER_CODE.JavaScript);
      setPhase('coding');
      toast.success('✅ Problem generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate problem. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  const evaluateCode = async () => {
    if (!code.trim() || code === STARTER_CODE[config.language]) {
      return toast.error('Please write your solution first');
    }
    setEvaluating(true);
    try {
      const { data } = await api.post(`/coding/${sessionId}/evaluate`, { code, language: config.language });
      setResult(data.evaluation);
      setPhase('result');
      toast.success('✅ Code evaluated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Evaluation failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const reset = () => {
    setPhase('setup');
    setProblem(null);
    setSessionId(null);
    setCode('');
    setResult(null);
  };

  const diffColor = { Easy: 'var(--success)', Medium: 'var(--warning)', Hard: 'var(--error)' };

  if (phase === 'setup') return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>💻 AI Coding Interview</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Solve AI-generated coding problems and get instant AI code review
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>💻</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Configure Your Coding Challenge</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>AI will generate a problem tailored to your settings</div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Role</label>
            <select className="form-select" value={config.role} onChange={e => setConfig(c => ({ ...c, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    className={`btn btn-sm ${config.difficulty === d ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, justifyContent: 'center', color: config.difficulty === d ? 'white' : diffColor[d] }}
                    onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select className="form-select" value={config.language} onChange={e => setConfig(c => ({ ...c, language: e.target.value }))}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16, background: 'var(--bg-card)', borderRadius: 12, marginBottom: 24 }}>
            {[['🤖', 'AI Generated'], ['⚡', 'Instant Review'], ['📊', 'Complexity Analysis']].map(([icon, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28 }}>{icon}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-xl"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={generateProblem}
            disabled={loading}
          >
            {loading ? <><div className="spinner spinner-sm" /> Generating problem...</> : '💻 Generate Problem'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>💻 Coding Challenge</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{config.language} • {config.role}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge" style={{ background: `${diffColor[config.difficulty]}22`, color: diffColor[config.difficulty] }}>
            {config.difficulty}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={reset}>🔄 New Problem</button>
        </div>
      </div>

      <div className="coding-layout">
        {/* Problem Statement */}
        <div>
          <div className="problem-statement">
            {problem && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{problem.title}</div>
                  <span className="badge" style={{ background: `${diffColor[problem.difficulty]}22`, color: diffColor[problem.difficulty] }}>
                    {problem.difficulty}
                  </span>
                </div>

                <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  {problem.description}
                </div>

                {problem.examples?.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>Examples</div>
                    {problem.examples.map((ex, i) => (
                      <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 14, marginBottom: 10, fontFamily: 'monospace', fontSize: 13 }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Input: </span><span style={{ color: 'var(--success)' }}>{ex.input}</span></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Output: </span><span style={{ color: 'var(--primary)' }}>{ex.output}</span></div>
                        {ex.explanation && <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>💡 {ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints?.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Constraints</div>
                    {problem.constraints.map((c, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                        • {c}
                      </div>
                    ))}
                  </div>
                )}

                {problem.hints?.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>💡 Hints</div>
                    {problem.hints.map((h, i) => (
                      <div key={i} style={{ fontSize: 13, padding: '8px 12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, marginBottom: 6 }}>
                        {i + 1}. {h}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Code Editor + Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="code-editor">
            <div className="code-editor-header">
              <div className="code-editor-dots">
                <div className="code-dot red" />
                <div className="code-dot yellow" />
                <div className="code-dot green" />
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{config.language}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{code.split('\n').length} lines</span>
            </div>
            <textarea
              className="code-textarea"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Write your solution here..."
              spellCheck={false}
            />
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={evaluateCode}
            disabled={evaluating}
          >
            {evaluating
              ? <><div className="spinner spinner-sm" /> AI is reviewing your code...</>
              : '🚀 Submit & Evaluate'}
          </button>

          {/* Result */}
          {result && (
            <div className="evaluation-result">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>🤖 AI Code Review</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: result.score >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                  {result.score}/100
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 12, background: result.correctness ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${result.correctness ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 20 }}>{result.correctness ? '✅' : '❌'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Correctness</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{result.timeComplexity}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Time Complexity</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>{result.spaceComplexity}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Space Complexity</div>
                </div>
              </div>

              <div style={{ padding: 12, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
                💬 {result.feedback}
              </div>

              {result.optimizedApproach && (
                <div style={{ padding: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>⚡ OPTIMAL APPROACH</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{result.optimizedApproach}</div>
                </div>
              )}

              {result.suggestions?.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💡 Suggestions</div>
                  {result.suggestions.map((s, i) => (
                    <div key={i} style={{ fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      {i + 1}. {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
