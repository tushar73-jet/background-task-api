import { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw, CheckCircle2, XCircle, Clock, LayoutDashboard, History } from 'lucide-react'
import './App.css'

function App() {
    const [jobs, setJobs] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/jobs')
            const data = await res.json()
            setJobs(data)
        } catch (err) {
            console.error('Failed to fetch jobs:', err)
        } finally {
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
        const interval = setInterval(fetchJobs, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            })
            setName('')
            setDescription('')
            fetchJobs()
        } catch (err) {
            console.error('Failed to create job:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
            fetchJobs()
        } catch (err) {
            console.error('Failed to delete job:', err)
        }
    }

    const handleRetry = async (id) => {
        try {
            await fetch(`/api/jobs/${id}/retry`, { method: 'POST' })
            fetchJobs()
        } catch (err) {
            console.error('Failed to retry job:', err)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="icon success" size={20} />
            case 'failed': return <XCircle className="icon error" size={20} />
            case 'pending': return <Clock className="icon pending animate-pulse" size={20} />
            default: return <Clock className="icon" size={20} />
        }
    }

    const stats = {
        total: jobs.length,
        completed: jobs.filter(j => j.status === 'completed').length,
        failed: jobs.filter(j => j.status === 'failed').length,
        pending: jobs.filter(j => j.status === 'pending').length,
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-title">
                    <LayoutDashboard className="accent" size={32} />
                    <h1>Task Orchestrator</h1>
                </div>
                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value success">{stats.completed}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value error">{stats.failed}</span>
                        <span className="stat-label">Failed</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value pending">{stats.pending}</span>
                        <span className="stat-label">In Queue</span>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="form-section">
                    <div className="card glass">
                        <h2>Create New Task</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Job Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Data Sync, Cache Clear..."
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional details about the task..."
                                    rows="3"
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                                Create Task
                            </button>
                        </form>
                    </div>
                </section>

                <section className="list-section">
                    <div className="section-header">
                        <h2>Recent Activities</h2>
                        <button onClick={fetchJobs} className="btn-icon">
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    {fetchLoading ? (
                        <div className="loading-container">
                            <RefreshCw className="animate-spin accent" size={40} />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="empty-state">
                            <History size={48} className="text-muted" />
                            <p>No tasks found. Start by creating one!</p>
                        </div>
                    ) : (
                        <div className="job-grid">
                            {jobs.map(job => (
                                <div key={job._id} className={`job-card glass ${job.status}`}>
                                    <div className="job-header">
                                        <div className="job-info">
                                            <h3>{job.name}</h3>
                                            <p className="description">{job.description || 'No description provided'}</p>
                                        </div>
                                        <div className="job-status">
                                            {getStatusIcon(job.status)}
                                        </div>
                                    </div>

                                    {job.status === 'completed' && job.result && (
                                        <div className="job-result">
                                            <p><strong>Result:</strong> {job.result.output}</p>
                                        </div>
                                    )}

                                    {job.status === 'failed' && job.errorDetails && (
                                        <div className="job-error">
                                            <p><strong>Error:</strong> {job.errorDetails}</p>
                                        </div>
                                    )}

                                    <div className="job-footer">
                                        <span className="timestamp">
                                            {new Date(job.createdAt).toLocaleTimeString()}
                                        </span>
                                        <div className="actions">
                                            {(job.status === 'failed' || job.status === 'completed') && (
                                                <button
                                                    onClick={() => handleRetry(job._id)}
                                                    className="btn-text"
                                                    title="Retry Job"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="btn-text danger"
                                                title="Delete Job"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default App
