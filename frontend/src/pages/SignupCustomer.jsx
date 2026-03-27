import React, { useState } from 'react'
import '../styles/SignupCustomer.css'

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
	return re.test(String(email).toLowerCase())
}

export default function SignupCustomer() {
	const [form, setForm] = useState({ name: '', email: '', password: '' })
	const [errors, setErrors] = useState({})
	const [submitting, setSubmitting] = useState(false)
	const [success, setSuccess] = useState('')

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((f) => ({ ...f, [name]: value }))
		if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
		if (success) setSuccess('')
	}

	const validate = () => {
		const err = {}
		if (!form.name.trim()) err.name = 'Name is required'
		if (!form.email.trim() || !validateEmail(form.email)) err.email = 'Please enter a valid email'
		if (!form.password || form.password.length < 6) err.password = 'Password must be at least 6 characters'
		setErrors(err)
		return Object.keys(err).length === 0
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!validate()) return
		setSubmitting(true)
		try {
			const res = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})
			if (res.ok) {
				setSuccess('Account created successfully')
				setForm({ name: '', email: '', password: '' })
				setErrors({})
			} else {
				const data = await res.json().catch(() => null)
				setErrors({ form: data?.message || 'Signup failed. Please try again.' })
			}
		} catch (err) {
			setErrors({ form: 'Network error. Please try again.' })
		} finally {
			setSubmitting(false)
		}
	}

	const isValidPreview = form.name.trim() && validateEmail(form.email) && form.password.length >= 6

	return (
		<div className="signup-page">
			<div className="signup-card">
				<h2 className="signup-title">Create account</h2>
				<p className="signup-sub">Join and start designing unique T‑shirts</p>
				<form className="signup-form" onSubmit={handleSubmit} noValidate>
					{errors.form && <div className="form-error">{errors.form}</div>}

					<label className="field">
						<span className="label">Name</span>
						<input
							name="name"
							value={form.name}
							onChange={handleChange}
							className={errors.name ? 'input error' : 'input'}
							placeholder="Your full name"
						/>
						{errors.name && <small className="field-error">{errors.name}</small>}
					</label>

					<label className="field">
						<span className="label">Email</span>
						<input
							name="email"
							value={form.email}
							onChange={handleChange}
							className={errors.email ? 'input error' : 'input'}
							placeholder="you@example.com"
							type="email"
						/>
						{errors.email && <small className="field-error">{errors.email}</small>}
					</label>

					<label className="field">
						<span className="label">Password</span>
						<input
							name="password"
							value={form.password}
							onChange={handleChange}
							className={errors.password ? 'input error' : 'input'}
							placeholder="Create a password"
							type="password"
						/>
						{errors.password && <small className="field-error">{errors.password}</small>}
					</label>

					<button className="submit-btn" type="submit" disabled={submitting || !isValidPreview}>
						{submitting ? 'Creating...' : 'Create account'}
					</button>

					{success && <div className="form-success">{success}</div>}
				</form>

				<div className="signup-footer">Already have an account? Sign in</div>
			</div>
		</div>
	)
}

